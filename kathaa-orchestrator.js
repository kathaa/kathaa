var sleep = require('sleep');

var kathaaOrchestrator = function (module_library, kue, client){
  this.module_library = module_library;
  this.kue = kue;
  this.client = client;
}

kathaaOrchestrator.prototype.executeGraph = function(graph, beginNode){
  this.preprocessGraph(graph, function(_kathaaOrchestrator){
    // _kathaaOrchestrator.client.emit("debug_message", "Inside Preprocess");


    //TO-DO: Handle empty graph in preprocessGraph validations, 
    // and add an error callback
    var _beginNode = graph.nodeMap[beginNode.id]

    // // Copy beginNode kathaa_inputs into the _beginNode instance inside graph
    _beginNode.kathaa_inputs = beginNode.kathaa_inputs;
    _beginNode.kathaa_outputs = {}

    _kathaaOrchestrator.queueNodeJob(graph, _beginNode.id);

  });
}

function getInPorts(module_library, component_name){
  return module_library.component_library[component].inports;
}
function getOutPorts(module_library, component_name){
  return module_library.component_library[component].outports;
}

kathaaOrchestrator.prototype.queueNodeJob = function(graph, node_id){
  var node = graph.get_node(node_id);
  var job = this.kue.create(  "JOB::"+node.id, 
                              { graph:graph, 
                                node:node
                              });

  // this.client.emit("debug_message", "Job Enqueued : "+node.id);
  job.orchestrator = this;


  job.on('complete', function(kathaa_outputs){

    debug(job.orchestrator.client, kathaa_outputs);

    //For reference during enqueing
    graph.nodeMap[job.data.node.id].kathaa_outputs = mergeObjects(
                                    graph.nodeMap[job.data.node.id].kathaa_outputs,
                                    kathaa_outputs
                                    );

    console.log("Job Complete : "+job.id);

    // Wrap up job-complete formalities
    job.orchestrator.client.emit("debug_message", "Job Complete : "+job.id);
    job.orchestrator.client.emit("debug_message", graph);
    job.orchestrator.client.emit("node_processing_complete", {node:graph.get_node(job.data.node.id)});;
    job.orchestrator.client.emit("execute_workflow_progress", {progress:100, node_id: job.data.node.id});

    // Start preparing for prospective new jobs

    var current_node, child_node, 
        parent_nodes, parent_node_id, 
        edge, kathaa_input;

    // for all children...
    current_node = graph.get_node(job.data.node.id);
    
    for(var _child_id in current_node.children){
      edge = graph.get_node(current_node.id).children[_child_id];

      // the edge object should ideally hold corresponding results ?
      // Check if all dependencies (inports) of the node are satisfied
      // If they are satisfied, automatically compute the kathaa_input 
      // inside the graph-level node instance
      if(graph.check_dependency_satisfied(_child_id, job.orchestrator.module_library)){
        job.orchestrator.queueNodeJob(graph, _child_id)
      }else{
        console.log("Dependency Failed for child : "+_child_id);
      }

    }

  });

  this.kue.process("JOB::"+node.id, 5, function(current_job, done){    
    // console.log("Processing : "+current_job.data.node.id);
    debug(job.orchestrator.client, "Processing :"+current_job.id+"  node id : "+current_job.data.node.id);

    //Using custom progress tracker, as the Kue progress tracker is acting funny
    var progressTrackerWrapper = function(progress){
      job.orchestrator.client.emit("execute_workflow_progress", 
                          { progress : progress, 
                            node_id : current_job.data.node.id
                          });
    }

    // The current_job object is guaranteed to have `kathaa_inputs` object properly defined
    // The job of the process and return the `kathaa_outputs` object

    //TO-DO : Handle unknown component here

    //Check if custom process_definitions have been provided
    
    //Look up the corresponding process in module library
    var _process = job.orchestrator.module_library.processes[node.component.replace("/","_")]
    // _process(current_job, progressTrackerWrapper, done);

    //Check if the node itself supplies a process defintion
    if(current_job.data.node.process_definition){
      //then use this process definition instead
      //TO-DO Handle errors here
      //TO-DO Come up with a better way to run in scope
      //      Maybe by using job.orchestrator.module_library.library_object?
      try{
        _process = new Function("return " + current_job.data.node.process_definition)();
        _process(current_job.data.node.kathaa_inputs, progressTrackerWrapper, done)
      }catch(err){
        job.failed().error(err);
        done(err);
      }

    }else{
       // Use the default process definition
      _process(current_job.data.node.kathaa_inputs, progressTrackerWrapper, done);

    }
  })

  job.on('failed', function(err){
    //TO-DO: Handle 
    console.log("Job Failed : "+job.id);
    console.log(err);
    job.orchestrator.client.emit("node_processing_failed", {node: job.data.node, error: err});    
    // job.orchestrator.client.emit("debug_message", "Job Failed : "+job.id);
  })

  job.save();
}

function debug(client, msg){
  client.emit("debug_message", msg);
}

//Preprocesses the graph to optimise some of the future queries on the graph
// - computes "children" of all nodes 
// - computes starting node, and the ending nodes
// - TO-DO : Remove portion of graph which does not begin with a sentence_input and end with a sentence_output
// - TO-DO : Add Validations for the graph
kathaaOrchestrator.prototype.preprocessGraph = function(graph, callback){
  //Create alias of 'graph.nodes' to represent "graph.processes"
  graph.nodes = graph.processes

  // Compute default starting nodes, output nodes, and a nodeMap

  // nodeMap is a lookup table to obtain the node object by node-id
  graph.nodeMap = {}
  var node;
  for(var node_id in graph.processes){
    graph.nodeMap[node_id] = graph.processes[node_id];
    node = graph.nodeMap[node_id];
    node['id'] = node_id;
    // if(node.component == "core/sentence_ouput"){
    //   if(graph.outputNodes == undefined){
    //     graph.outputNodes = [node];
    //   }else{
    //     graph.outputNodes.push(node);
    //   }
    // }
  }

  // Mark connection between nodes in the data structure
  var edge;
  var source, target;
  for(var _index in graph.connections){
    edge = graph.connections[_index];

    // Maintain a table of targets(children) in the node objects
    // key being the target id and the value being the edge object (which also contains the port information)
    source = graph.nodes[edge.src.process];
    target = graph.nodes[edge.tgt.process];

    if(source.children == undefined){
      source.children = {}
    }
    source.children[target.id] = edge;


    // Maintain a table of targets parents
    // This will be useful in case of modules which have
    // multiple dependencies. 
    // Modules like that can be enqueud **only** after all their dependencies 
    // are met.

    if(target.parents == undefined){
      target.parents = {}
    }
    // the key being the id of the parent node,
    // and the value being the corresponding edge object
    target.parents[source.id] = edge;
  }

  graph.get_node = function(nodeId){
    return this.nodeMap[nodeId];
  }

  graph.set_inport_value = function(node_id, inport, value){
    var node;
    node = this.get_node(node_id);
    if(node.kathaa_inputs == undefined){
      node.kathaa_inputs = {}
    }
    node.kathaa_inputs[inport] = value;
  }

  graph.set_outport_value = function(node_id, outport, value){
    var node;
    node = this.get_node(node_id);

    if(node.kathaa_outputs == undefined){
      node.kathaa_outputs = {}
    }
    node.kathaa_outputs[outport] = value;
  }

  graph.get_outport_value = function(node_id, outport){
    var node;
    node = this.get_node(node_id);

    if(node.kathaa_outputs && (outport in node.kathaa_outputs)){
      return node.kathaa_outputs[outport];
    }
    return false;
  }
  graph.check_dependency_satisfied = function(node_id, module_library){
    var node = this.get_node(node_id);

    // When all inports are filled !!
    // When all parents have their corresponding edges satisfied
    var edge, parent_port, outport_value, my_inport;
    for(var _parent_id in node.parents){
      edge = node.parents[_parent_id];
      parent_port = edge.src.port;
      my_inport = edge.tgt.port;

      // if kathaa_output of parent is defined !!
      outport_value = this.get_outport_value(_parent_id, parent_port)
      if(outport_value == false){
        return false;  
      }

      // If they are satisfied, automatically keep computing 
      // the kathaa_input inside the graph-level node instance
      this.set_inport_value(node_id, my_inport, outport_value);
    }

    // Now check if all the (non-optional) inports of the said component
    // are represented in kathaa-input
    var inport;
    for(var _index in module_library.component_library[node.component].inports){
      inport = module_library.component_library[node.component].inports[_index];

      if(inport.optional){
        //this check can be ignored for optional ports
      }else{
        console.log(inport.name);
        if(inport.name in node.kathaa_inputs){
        }else{
          return false;
        }
      }

    }
    
    return true;
  }

  //Validation Marker
  graph.isValid = true;
  callback(this);
}

function mergeObjects(_o1, _o2){
    if(_o2 == undefined && _o1 != undefined){
        return _o1;
    }
    if(_o1 == undefined && _o2 != undefined){
        return _o2;
    }
    if(_o1 == undefined && _o2 == undefined){
        return {}
    }
    //Copy all _o2 keys into _o1
    for(var _key in _o2){
        _o1[_key] = _o2;
    }
    return _o2;
}

module.exports = kathaaOrchestrator;