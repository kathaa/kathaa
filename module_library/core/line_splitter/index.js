module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  // TO-DO Refactor This block
  // For all keys in kathaa_inputs
  var out_key;
  for(var key in kathaa_inputs){ 
    out_key = key.replace("in_", "out_");

    kathaa_outputs[out_key] = new kathaaData();
    kathaa_inputs[key] = new kathaaData(kathaa_inputs[key]);

    // for all blobs in kathaaData 
    var new_blob;
    var blobs = kathaa_inputs[key].getAllBlobs();
    for(var idx in blobs){
      new_blob = blobs[idx]['value'];

      //Split the contents of the blob based on new line
      new_blob = new_blob.split("\n")
      console.log(new_blob);
      
      for(var i in new_blob){
        kathaa_outputs[out_key].set(blobs[idx]['key']+"."+i, new_blob[i]);
      }
    }

    // Render new kathaaData in kathaa_outputs
    kathaa_outputs[out_key] = kathaa_outputs[out_key].render();
  }
  //passback computed results via callback
  done && done(null, kathaa_outputs);
}