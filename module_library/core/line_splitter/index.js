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
    var blob;
    var blob_keys = kathaa_inputs[key].getKeys()
    for(var idx in blob_keys){
      blob = kathaa_inputs[key].get(blob_keys[idx])

      //Split the contents of the blob based on new line
      blob = blob.split("\n")

      for(var i in blob){
        kathaa_outputs[out_key].set(blob_keys[idx]+"."+i, blob[i]);
        console.log(blob_keys[idx]+"."+i, blob[i])
      }
    }

    // Render new kathaaData in kathaa_outputs
    kathaa_outputs[out_key] = kathaa_outputs[out_key].render();
  }

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}