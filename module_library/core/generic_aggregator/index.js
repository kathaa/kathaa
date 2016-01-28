module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  // TO-DO Refactor This block
  // For all keys in kathaa_inputs
  var out_key;
  console.log(kathaa_inputs);
  
  for(var key in kathaa_inputs){ 
    out_key = key.replace("in_", "out_");

    kathaa_outputs[out_key] = new kathaaData();
    kathaa_inputs[key] = new kathaaData(kathaa_inputs[key]);
    
    // this just "squashes" all blobs into a single blob, using "\n"
    // as a delimiter
    // this does the same across all its input channels

    // Render new kathaaData in kathaa_outputs
    kathaa_outputs[out_key].set(0, kathaa_inputs[key].render_natural());
    kathaa_outputs[out_key] = kathaa_outputs[out_key].render();
  }
  console.log(kathaa_outputs);
  //passback computed results via callback
  done && done(null, kathaa_outputs);
}