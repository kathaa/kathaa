// imported libraries have to be imported in the 
// global scope, so that user defined/user modified functions 
// also have access to them
// 
// example
// GLOBAL.core_request = require('request');
//
// where "core" is the namespace to avoid conflicts between different modules
var core = function(){
}
// Note : Every registered component of the type "core/component_name" has to have a 
// corresponding process of the name "core_component_name" ( '/' replace with '_' )
// module_library.processes["core_sentence_input"](null,null,null);

//TO-DO : in_ssf doesnt make sense conceptually in case of sentence_input.
//        it should be made generic to support multiple input types, like raw_text, etc
//
//  // progress(10); // Progress Tracker
// refer to module_library/*.json to understand available keys in inputs and expected outputs


core.prototype.core_sentence_input = function(kathaa_inputs, progress, done){
  var kathaa_outputs = {};
  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['sentence_input'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}

core.prototype.core_sentence_output = function(kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['in_ssf'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}

core.prototype.core_echo = function(kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['in_ssf'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}

core.prototype.core_random_merger = function(kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  var total_inputs = 4;
  if(!kathaa_inputs['in_ssf_4']){
    total_inputs = 3;
  }
  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['in_ssf_'+parseInt(Math.random()*total_inputs + 1)];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}

module.exports = core;