var sleep = require('sleep');

var kathaaOrchestrator = function (module_library, kue, client){
  this.module_library = module_library;
  this.kue = kue;
  this.client = client;
}

kathaaOrchestrator.prototype.executeGraph = function(graph, input_sentence){
  this.preprocessGraph(graph, function(_kathaaOrchestrator){
    // _kathaaOrchestrator.client.emit("debug_message", "Inside Preprocess");

    //TO-DO: Handle empty graph in preprocessGraph validations, 
    // and add an error callback
    graph.beginNode.input_sentence = input_sentence;

    _kathaaOrchestrator.queueNodeJob(graph, graph.beginNode);
  });
}

kathaaOrchestrator.prototype.queueNodeJob = function(graph, node){
  var job = this.kue.create("JOB::"+node.id, {node:node, graph:graph});
  // this.client.emit("debug_message", "Job Enqueued : "+node.id);
  job.orchestrator = this;


  job.on('complete', function(processed_node){
    job.data.node = processed_node;

    console.log("Job Complete : "+job.id);
    job.orchestrator.client.emit("debug_message", "Job Complete : "+job.id);
    job.orchestrator.client.emit("node_processing_complete", {node:job.data.node});;
    job.orchestrator.client.emit("execute_workflow_progress", {progress:100, node_id: node.id});

    // Enqueue jobs corresponding to child nodes
    // TO-DO : Make sure the child nodes has all their dependent inputs available
    if(job.data.node.children){
      for(var _index in job.data.node.children){
        // Mark output of processed node as input of to-be-processed node
        // TO-DO : Handle inport and outport definition 
        //         instead of assumed inSSF and outSSF definitions
        job.data.node.children[_index].in_ssf = job.data.node.out_ssf
        console.log(job.data.node.children[_index].in_ssf);
        //Queue corresponding jobs for the child node
        job.orchestrator.queueNodeJob(graph, job.data.node.children[_index])
      }
    }

  });

  job.on('failed', function(err){
    //TO-DO: Handle 
    console.log("Job Failed : "+job.id);
    console.log(err);
    job.orchestrator.client.emit("node_processing_failed", {node: job.data.node, error: err});    
    // job.orchestrator.client.emit("debug_message", "Job Failed : "+job.id);
  })

  job.save();

  this.kue.process("JOB::"+node.id, 5, function(current_job, done){    
    console.log("Processing : "+job.data.node.id);
    // job.orchestrator.client.emit("debug_message", "Processing :"+current_job.id+"  node id : "+current_job.data.node.id);

    //Using custom progress tracker, as the Kue progress tracker is acting funny
    var progressTrackerWrapper = function(progress, data){
      job.orchestrator.client.emit("execute_workflow_progress", {progress:progress, node_id: data.id});
    }

    //Look up the corresponding process in module library
    var _process = job.orchestrator.module_library.processes[node.component.replace("/","_")]
    _process(current_job, progressTrackerWrapper, done);
  })
}

//Preprocesses the graph to optimise some of the future queries on the graph
// - computes "children" of all nodes 
// - computes starting node, and the ending nodes
// - TO-DO : Remove portion of graph which does not begin with a sentence_input and end with a sentence_output
// - TO-DO : Add Validations for the graph
kathaaOrchestrator.prototype.preprocessGraph = function(graph, callback){
  //Create alias of 'graph.nodes' to represent "graph.processes"
  graph.nodes = graph.processes
  // Mark connection between nodes in the data structure
  var edge;
  var source, target;
  for(var _index in graph.connections){
    edge = graph.connections[_index];

    source = graph.nodes[edge.src.process];
    target = graph.nodes[edge.tgt.process];

    if(source.children == undefined){
      source.children = [target]
    }else{
      source.children.push(target);
    }
  }

  // Compute starting nodes, and output nodes
  var node;
  for(var _node in graph.processes){
    node = graph.processes[_node];
    node.id = _node;
    if(node.component == "core/sentence_input"){
      graph.beginNode = node;
    }else if(node.component == "core/sentence_ouput"){
      if(graph.outputNodes == undefined){
        graph.outputNodes = [node];
      }else{
        graph.outputNodes.push(node);
      }
    }
  }

  //Validation Marker
  graph.isValid = true;
  callback(this);
}

module.exports = kathaaOrchestrator;