var sleep = require('sleep');
GLOBAL.kathaaData = require('./kathaa-data');

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

    // Copy beginNode kathaa_inputs into the _beginNode instance inside graph
    _beginNode.kathaa_inputs = beginNode.kathaa_inputs;
    _beginNode.kathaa_outputs = {}

    if(_beginNode.component == "core/sentence_input"){
      // In case of sentence_input, kathaa_input is not in kathaa-data format
      // convert it into kathaa data format

      for(var key in beginNode.kathaa_inputs){
        var temp = beginNode.kathaa_inputs[key].trim().split("\n");
        _beginNode.kathaa_inputs[key] = new kathaaData("");
        for(var idx in temp){
          _beginNode.kathaa_inputs[key].set(idx, temp[idx]);
        }
        _beginNode.kathaa_inputs[key] = _beginNode.kathaa_inputs[key].render();
      }
    }

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
    //TO-DO :: Refactor this block of code !!

    // console.log("Processing : "+current_job.data.node.id);
    debug(job.orchestrator.client, "Processing :"+current_job.id+"  node id : "+current_job.data.node.id);

    // The current_job object is guaranteed to have `kathaa_inputs` object properly defined
    // The job of the process and return the `kathaa_outputs` object

    // `kathaa_inputs` now holds the input-port values for a whole list of sentences.
    // instead of a single sentence !!
    //
    // Parse all individual kathaa_inputs into their respective kathaa-data object
    job.data.node.kathaa_inputs_objectified = {}
    for(var input_port in job.data.node.kathaa_inputs){
      job.data.node.kathaa_inputs_objectified[input_port] = new kathaaData(job.data.node.kathaa_inputs[input_port]);
    }
    job.data.node.kathaa_outputs = {}
    job.data.node.kathaa_outputs_objectified = {};

    // One key assumption is all nodes will have atleast one input
    // and all kathaa_input_objects will have the exact same set of keys(as defined by input_ports)
    // TO-DO :: Add Validation here for the same

    // Define the process
    var _process;
    try{
      //Check if the node itself supplies a process defintion
      if(current_job.data.node.process_definition){
        //then use this process definition instead
          _process = new Function("return " + current_job.data.node.process_definition)();
      }else{
         //Look up the corresponding process in module library
         _process = job.orchestrator.module_library.processes[node.component];
      }
    }catch(err){
      new Error("Faulty function definition in process : "+node.component);
      job.failed().error(err);
      done(err);
    }

    // For all Sentences.......Try to run the process, and collect the output
    // Build a proper kathaa_output object in the RAW/render() form of the kathaa-data object
    // and then mark as job-completed.
    var first_input_port = Object.keys(job.data.node.kathaa_inputs)[0]
    var sentence_ids = job.data.node.kathaa_inputs_objectified[first_input_port].getKeys();
    var weight_of_sentence = (1/job.data.node.kathaa_inputs_objectified[first_input_port].getKeys().length);

    var outputs_received = 0;
    function currentProgress(){
      return (outputs_received/job.data.node.kathaa_inputs_objectified[first_input_port].getKeys().length);
    }

    var _partial_job_done =  function(sentence_id){
      var _sentence_id = sentence_id;
      return function(error, _param){
                // Custom _done wrapper to be passed into the individual processes
                // if error, is defined, then _param will represent a custom error message
                // if the job successfully completes, error has to be passed as null, and _param
                // represents `kathaa_input`
                if(error){
                  // Currently the whole job gets failed if even one of the sentence fails execution
                  // TO-DO :: Fix this....probably mark error state in the Kathaa-Data format
                  job.failed().error(error);
                  return done(error);
                }else{
                  // In case of successful completion of partial-job
                  // Iterate over _param and add keys to respective sentence_ids in kathaa_outputs_objectified
                  for(var key in _param){
                    //Check if the object exists
                    if(job.data.node.kathaa_outputs_objectified.hasOwnProperty(key)){
                      //Cool do nothing :D everything is in place :D
                    }
                    else{
                      job.data.node.kathaa_outputs_objectified[key] = new kathaaData("");
                    }
                    //Set the param corresponding to the sentence_id
                    job.data.node.kathaa_outputs_objectified[key].set(_sentence_id, _param[key]);
                    // job.data.node.kathaa_outputs_objectified[key].data[sentence_id+""] = _param[key];
                  }
                  outputs_received += 1;

                  // Wait till all outputs have been received
                  if(currentProgress() == 1){
                    //Job Complete
                    //Transfer all kathaa_outputs_objectified to kathaa_outputs
                    for(var key in job.data.node.kathaa_outputs_objectified){
                      job.data.node.kathaa_outputs[key] = job.data.node.kathaa_outputs_objectified[key].render();
                    }
                    return done(error, job.data.node.kathaa_outputs)
                  }else{
                    //Mark Progress
                    job.orchestrator.client.emit("execute_workflow_progress",
                                        { progress :  (currentProgress())*100,
                                          node_id : current_job.data.node.id
                                        });
                  }
                }
            }
          }


    for(var _idx in sentence_ids){

      //Build per-sentence kathaa_input
      var _sentence_kathaa_inputs = {}
      for(var input_port in job.data.node.kathaa_inputs_objectified){
        _sentence_kathaa_inputs[input_port] = job.data.node.kathaa_inputs_objectified[input_port].get(sentence_ids[_idx]);
      }

      //Try to execute the process
      try{
        _process(_sentence_kathaa_inputs,
          function(progress){
            //Using custom progress tracker, as the Kue progress tracker is acting funny
            job.orchestrator.client.emit("execute_workflow_progress",
                                { progress :  (currentProgress() + (progress/100)*weight_of_sentence)*100,
                                  node_id : current_job.data.node.id
                                });
          },
          new _partial_job_done(sentence_ids[_idx])
      );
      }catch(err){
        job.failed().error(err);
        done(err);
      }
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


      // NOTE :
      // Possible Heisenbug here
      // Fix This
      console.log("Time ::", process.hrtime());
      // console.log(edge);

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
