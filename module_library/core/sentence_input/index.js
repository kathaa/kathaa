module.exports = function (kathaa_inputs, progress, done){
  var kathaa_outputs = {};
  //Your Voodoo goes here
  kathaa_outputs['out_raw'] = kathaa_inputs['input_sentence'];

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}