var sleep = require('sleep');

var kathaaOrchestrator = function (module_library, kue, client){
  this.module_library = module_library;
  this.kue = kue;
  this.client = client;
}

kathaaOrchestrator.prototype.executeGraph = function(graph){
  this.preprocessGraph(graph, function(_kathaaOrchestrator){
    // _kathaaOrchestrator.client.emit("debug_message", "Inside Preprocess");
    _kathaaOrchestrator.queueNodeJob(graph, graph.beginNode);
    
  });
}

kathaaOrchestrator.prototype.queueNodeJob = function(graph, node){
  var job = this.kue.create("JOB::"+node.id, {node:node, graph:graph});
  // this.client.emit("debug_message", "Job Enqueued : "+node.id);
  job.orchestrator = this;

  job.on('complete', function(){
    console.log("Job Complete : "+job.id);
    // job.orchestrator.client.emit("debug_message", "Job Complete : "+job.id);
    job.orchestrator.client.emit("execute_workflow_progress", {progress:100, node_id: node.id});

    //Enqueue jobs corresponding to child nodes
    if(job.data.node.children){
      for(var _index in job.data.node.children){
        job.orchestrator.queueNodeJob(graph, job.data.node.children[_index])
      } 
    }

  });

  job.on('failed', function(){
    //TO-DO: Handle 
    console.log("Job Failed : "+job.id);
    // job.orchestrator.client.emit("debug_message", "Job Failed : "+job.id);
  })

  job.on('progress', function(progress, node){
    console.log(node.id+" "+progress);
    // job.orchestrator.client.emit("debug_message", "Progress of "+node.id+" ==="+progress);
    job.orchestrator.client.emit("execute_workflow_progress", {progress:progress, node_id: node.id});
  })

  job.save();

  this.kue.process("JOB::"+node.id, 5, function(current_job, done){
    console.log("Processing : "+current_job.id);
    // job.orchestrator.client.emit("debug_message", "Processing :"+current_job.id+"  node id : "+current_job.data.node.id);

    var progressTrackerWrapper = function(progress, data){
      job.orchestrator.client.emit("execute_workflow_progress", {progress:progress, node_id: data.id});
    }

    dummy_process(current_job, progressTrackerWrapper);
    done && done();
  })

  //Enque job associated with Node
  //On job complete enqueue the jobs associated with its children 
}

function dummy_process(job, progress){

  sleep.usleep(100000);
  progress(10, job.data.node)
  sleep.usleep(100000);
  progress(20, job.data.node)
  sleep.usleep(100000);
  progress(30, job.data.node)
  sleep.usleep(100000);
  progress(40, job.data.node)
  sleep.usleep(100000);
  progress(50, job.data.node)
  sleep.usleep(100000);
  progress(60, job.data.node)
  sleep.usleep(100000);
  progress(70, job.data.node)
  sleep.usleep(100000);
  progress(80, job.data.node)
  sleep.usleep(100000);
  progress(90, job.data.node)
  sleep.usleep(100000);
  progress(100, job.data.node)

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