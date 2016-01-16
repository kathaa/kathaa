module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  //Your Voodoo goes here
  kathaa_outputs['out_ssf'] = kathaa_inputs['in_ssf'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}