module.exports = function (kathaa_inputs, progress, done){
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