var sleep = require('sleep');
GLOBAL.kathaaData = require('./kathaa-data');
var kathaaGraph = require('./kathaa-graph');


var kathaaOrchestrator = function (module_library, kue, client){
  this.module_library = module_library;
  this.kue = kue;
  this.client = client;
}

kathaaOrchestrator.prototype.executeGraph = function(_graph, beginNode){
  this.graph = new kathaaGraph(_graph);

  //TO-DO: Handle empty graph in preprocessGraph validations,
  // and add an error callback
  var _beginNode = this.graph.get_node(beginNode.id)
  _beginNode.kathaa_inputs = {};
  _beginNode.kathaa_outputs = {};

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
  }else{
    // Simply Copy over the kathaa_inputs
    for(var key in beginNode.kathaa_inputs){
      _beginNode.kathaa_inputs[key] = beginNode.kathaa_inputs[key];
    }
  }
  this.queueNodeJob(this.graph, _beginNode.id);
}

function getInPorts(module_library, component_name){
  return module_library.component_library[component].inports;
}
function getOutPorts(module_library, component_name){
  return module_library.component_library[component].outports;
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

    // console.log("Processing : "+current_job.data.node.id);
    debug(job.orchestrator.client, "Processing :"+job.id+"  node id : "+job.data.node.id);

    // The job object is guaranteed to have `kathaa_inputs` object properly defined
    // The job of the process and return the `kathaa_outputs` object

    // `kathaa_inputs` now holds the input-port values for a whole list of sentences.
    // instead of a single sentence !!

    // Handle user-intervention modules here
    // User-Intervention Modules, just require a user's manual intervention to complete

    var component = job.orchestrator.module_library.component_library[job.data.node.component];
    if(component.type == "kathaa-user-intervention"){
      console.log("User Intervention required in node : "+job.data.node.id+" of type : "+job.data.node.component)
      // job.orchestrator.client.emit("")
      // Copy in_* ports to out_* ports
      var kathaa_output_key ;
      job.data.node.kathaa_outputs = {};

      for(var key in job.data.node.kathaa_inputs){
        // If value exists in kathaa_inputs, Copy it into kathaa_outputs
          kathaa_output_key = key.replace("in_", "out_");
          job.data.node.kathaa_outputs[kathaa_output_key] = job.data.node.kathaa_inputs[key];
      }

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
                                  node_id : job.data.node.id
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
