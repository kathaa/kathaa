var sleep = require('sleep');
var core = function(){
}
// Note : Every registered component of the type "core/component_name" has to have a 
// corresponding process of the name "core_component_name" ( '/' replace with '_' )
// module_library.processes["core_sentence_input"](null,null,null);

core.prototype.core_sentence_input = function(job, progress, done){
  // progress(10, job.data.node);
  console.log("Inside Sentence Input !!" + job.data.node.input_sentence);

  //save computed output values
  job.data.node.out_ssf = job.data.node.input_sentence;
  console.log("Inside sentence input...processed ::"+job.data.node.out_ssf);
  done && done(null, job.data.node);
}

core.prototype.core_sentence_output = function(job, progress, done){
  // progress(10, job.data.node);
  console.log("Inside Sentence Output !! ");

  //save computed output values
  job.data.node.out_ssf = job.data.node.in_ssf;
  done && done(null, job.data.node);
}

module.exports = core;