module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  var data = kathaa_inputs['in_raw'];
  data = data.trim().split("\n");
  kathaa_outputs['out_ssf'] = new kathaaData("")
  for(var _idx in data){
    kathaa_outputs['out_ssf'].set(_idx, data[_idx]);
  }
  kathaa_outputs['out_ssf'] = kathaa_outputs['out_ssf'].render();

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}