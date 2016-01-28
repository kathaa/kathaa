var sleep = require('sleep');
GLOBAL.kathaaData = require('./kathaa-data');
var kathaaGraph = require('./kathaa-graph');

var kathaaOrchestrator = function (module_library, kue, client){
  this.module_library = module_library;
  this.kue = kue;
  this.client = client;
}

kathaaOrchestrator.prototype.executeGraph = function(_graph, beginNode, kathaaResources){
  this.graph = new kathaaGraph(_graph, kathaaResources);

  //TO-DO: Handle empty graph in preprocessGraph validations,
  // and add an error callback
  var _beginNode = this.graph.get_node(beginNode.id)
  _beginNode.kathaa_inputs = {};
  _beginNode.kathaa_outputs = {};

  if(_beginNode.component == "core/sentence_input"){
    // In case of sentence_input, kathaa_input is not in kathaa-data format
    // Blob-ify the inputs !!
    for(var key in beginNode.kathaa_inputs){
      var temp = new kathaaData();
      temp.set(0, beginNode.kathaa_inputs[key]);
      _beginNode.kathaa_inputs[key] = temp.render();
    }
  }else{
    // Simply Copy over the kathaa_inputs
    for(var key in beginNode.kathaa_inputs){
      _beginNode.kathaa_inputs[key] = beginNode.kathaa_inputs[key];
    }
  }

  this.queueNodeJob(this.graph, _beginNode.id);

  // Also enqueue all nodes of type kathaa-resources
  // as they should ideally also do some pre processings of their own
  // before they can be used by any evaluator modules
  for(var nodeId in this.graph.nodeMap){
    if(getComponentObject(this.module_library, this.graph.nodeMap[nodeId].component).type == "kathaa-resources"){
      this.queueNodeJob(this.graph, nodeId);
    }
  }
}

function getComponentObject(module_library, component_name){
  return module_library.component_library[component_name];
}
function getInPorts(module_library, component_name){
  return module_library.component_library[component_name].inports;
}
function getOutPorts(module_library, component_name){
  return module_library.component_library[component_name].outports;
}
function get_random_string(k){
  return Math.random().toString(36).substring(k);
}

kathaaOrchestrator.prototype.queueNodeJob = function(graph, node_id){
  var job_id = "JOB::"+graph.get_node(node_id).id+"_"+get_random_string(5);
  var job = this.kue.create(  job_id,
                              { graph:graph,
                                node:graph.get_node(node_id)
                              });
  // this.client.emit("debug_message", "Job Enqueued : "+node.id);
  job.orchestrator = this;


  job.on('complete', function(kathaa_outputs){
    //For reference during enqueing
    graph.get_node(job.data.node.id).kathaa_outputs = mergeObjects(
                                    graph.get_node(job.data.node.id).kathaa_outputs,
                                    kathaa_outputs
                                    );

    console.log("Job Complete : "+job.id);

    // Wrap up job-complete formalities
    // job.orchestrator.client.emit("debug_message", "Job Complete : "+job.id);
    // job.orchestrator.client.emit("debug_message", graph);

    var current_node = graph.get_node(job.data.node.id);

    // In case of sentence_input, dont pass kathaaData in kathaa_inputs
    // but convert it back to natural list of sentences
    if(current_node.component == "core/sentence_input"){
      //Clone current_node and modify the kathaa_inputs
      for(var key in current_node.kathaa_inputs){
        current_node.kathaa_inputs[key] = new kathaaData(current_node.kathaa_inputs[key])
        current_node.kathaa_inputs[key] = current_node.kathaa_inputs[key].render_natural();
      }
    }

    job.orchestrator.client.emit("node_processing_complete", {node:current_node});
    job.orchestrator.client.emit("execute_workflow_progress", {progress:100, node_id: job.data.node.id});

    // Start preparing for prospective new jobs

    var child_node,
        parent_nodes, parent_node_id,
        edge, kathaa_input;

    // for all children...

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

  this.kue.process(job_id, 20, function(current_job, done){
    //TO-DO :: Refactor this block of code !!

    console.log("Processing : "+current_job.data.node.id);
    debug(job.orchestrator.client, "Processing :"+job.id+"  node id : "+job.data.node.id);

    // The job object is guaranteed to have `kathaa_inputs` object properly defined
    // The job of the process and return the `kathaa_outputs` object

    // Define the process
    var _process;
    try{
      //Check if the node itself supplies a process defintion
      if(job.data.node.process_definition){
        //then use this process definition instead
          _process = new Function("return " + job.data.node.process_definition)();
      }else{
         //Look up the corresponding process in module library
         _process = job.orchestrator.module_library.processes[graph.get_node(node_id).component];
      }
    }catch(err){
      new Error("Faulty function definition in process : "+graph.get_node(node_id).component);
      job.failed().error(err);
      done(err);
    }

    // Different behaviours of different types of components/modules handled here
    var component = job.orchestrator.module_library.component_library[job.data.node.component];
    if(component.type == "kathaa-user-intervention"){
      console.log("User Intervention required in node : "+job.data.node.id+" of type : "+job.data.node.component)
      // job.orchestrator.client.emit("")
      // Copy in_* ports to out_* ports

      // This has to be done in the client side
      // Else it messes up the dependency resolver

      // var kathaa_output_key ;
      // job.data.node.kathaa_outputs = {};
      //
      // for(var key in job.data.node.kathaa_inputs){
      //   // If value exists in kathaa_inputs, Copy it into kathaa_outputs
      //     kathaa_output_key = key.replace("in_", "out_");
      //     job.data.node.kathaa_outputs[kathaa_output_key] = job.data.node.kathaa_inputs[key];
      // }

      // Emit user-intervention event
      job.orchestrator.client.emit("kathaa-user-intervention",
                          { node: job.data.node,
                            response_channel: job_id
                          });

      job.orchestrator.client.on(job_id, function(kathaa_outputs){
        // Remove the listener
        job.orchestrator.client.removeAllListeners(job_id);

        // Mark Job as Done when the user sends back modified kathaa_outputs
        done(null, kathaa_outputs);
      })
      return;
    }
    else if(component.type == "kathaa-resources"){
      console.log("Kathaa Resource Node Instantiated: "+job.data.node.id+" of type : "+job.data.node.component)
      
      // Re use the kathaa-user-intervention event for client-side simplicity
      //TO-DO : Refactor this !!
      job.orchestrator.client.emit("kathaa-user-intervention",
                          { node: job.data.node,
                            response_channel: job_id
                          });

      job.orchestrator.client.on(job_id, function(kathaa_outputs){
        // Remove the listener
        job.orchestrator.client.removeAllListeners(job_id);

        // Reformat Data 
        // TO-DO :: Ideally there should be a conditional here, 
        //          to check only for keys which 
        for(var key in kathaa_outputs){
              kathaa_outputs[key] = new kathaaData(kathaa_outputs[key])
              kathaa_outputs[key] = kathaa_outputs[key].render()
        }
        // Mark Job as Done when the user sends back modified kathaa_outputs
        done(null, kathaa_outputs);
      })
      return;
    }    
    else if(component.type == "kathaa-blob-adapter"){
      // Handle kathaa-blob-adapters here
            // TO-DO Refactor

            // Custom _done wrapper to be passed into the individual processes
            // if error, is defined, then _param will represent a custom error message
            // if the job successfully completes, error has to be passed as null, and _param
            // represents `kathaa_input`
            var _done = function(error, _param){
              if(error){
                job.failed().error(error);
                return done(error);
              }else{
                //In case of successful completion of job
                return done(error, _param)
              }
            }

            try{
              _process(current_job.data.node.kathaa_inputs, 
                      function(progress){
                        //Using custom progress tracker, as the Kue progress tracker is acting funny
                        job.orchestrator.client.emit("execute_workflow_progress",
                                            { progress :  progress/100,
                                              node_id : job.data.node.id
                                            });
                      }
                      , _done)
            }catch(err){
              job.failed().error(err);
              done(err);
            }

    }else{
      // `kathaa_inputs` now holds the input-port values for a whole list of sentences.
      // instead of a single sentence !!
      console.log(job.data.kathaa_inputs);
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

      // For all Sentences.......Try to run the process, and collect the output
      // Build a proper kathaa_output object in the RAW/render() form of the kathaa-data object
      // and then mark as job-completed.
      var first_input_port = Object.keys(job.data.node.kathaa_inputs)[0]
      
      // The assumption here is, the same keys are set for all the input ports
      // TO-DO : Fix this
      var blobs = job.data.node.kathaa_inputs_objectified[first_input_port].getAllBlobs();

      // Handle normal modules
      var weight_of_sentence = (1/blobs.length);

      var outputs_received = 0;
      function currentProgress(){
        return (outputs_received/blobs.length);
      }

      var _partial_job_done =  function(blob_id){
        var _blob_id = blob_id;
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
                    // Iterate over _param and add keys to respective blobs in kathaa_outputs_objectified
                    for(var key in _param){
                      //Check if the object exists
                      if(job.data.node.kathaa_outputs_objectified.hasOwnProperty(key)){
                        //Cool do nothing :D everything is in place :D
                      }
                      else{
                        job.data.node.kathaa_outputs_objectified[key] = new kathaaData();
                      }
                      //Set the param corresponding to the blob_id
                      job.data.node.kathaa_outputs_objectified[key].set(_blob_id, _param[key]);
                      // job.data.node.kathaa_outputs_objectified[key].data[blob_id+""] = _param[key];
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
                      // Temporarily Hide showing of partial job progress as on the client side
                      // socket.io is having a hard time dealing with so much data
                      // 
                      // job.orchestrator.client.emit("execute_workflow_progress",
                      //                     { progress :  (currentProgress())*100,
                      //                       node_id : job.data.node.id
                      //                     });
                    }
                  }
              }
            }

      for(var _idx in blobs){

        //Build per-sentence kathaa_input
        var _blob_kathaa_inputs = {}
        for(var input_port in job.data.node.kathaa_inputs_objectified){
          _blob_kathaa_inputs[input_port] = blobs[_idx]['value'];          
        }

        //Try to execute the process
        try{
          _process(_blob_kathaa_inputs,
            function(progress){
              //Using custom progress tracker, as the Kue progress tracker is acting funny
              job.orchestrator.client.emit("execute_workflow_progress",
                                  { progress :  (currentProgress() + (progress/100)*weight_of_sentence)*100,
                                    node_id : job.data.node.id
                                  });
            },
            new _partial_job_done(blobs[_idx]['key'])
        );
        }catch(err){
          job.failed().error(err);
          done(err);
        }
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
        _o1[_key] = _o2[_key];
    }
    return _o1;
}

module.exports = kathaaOrchestrator;
