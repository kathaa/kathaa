module.exports = function (kathaa_inputs, progress, done){
  var kathaa_outputs = {};
  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['sentence_input'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}