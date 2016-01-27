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
    var blobs = kathaa_inputs[key].getAllBlobsDict();

    // Aggregate blob_ids based on your custom requirement
    // In this case I aggregate all top-level blob-ids together
    // For example :
    // 0 : 0.1, 0.2, 0.3, 0.1.1
    // 1 : 1.1, 1.2, 1.3, 1.4.3
    // and so on...

    var aggregated_blob_ids = {}
    for(var blob_id in blobs){
      try{
        aggregated_blob_ids[blob_id.split(".")[0]].push(blob_id)
      }catch(err){
        aggregated_blob_ids[blob_id.split(".")[0]]=[blob_id]
      }
    }

    // Iterate over aggregated_blob_ids,
    var sub_blobs;
    var sub_blob_raw;
    for(var blob_id in aggregated_blob_ids){
      sub_blobs = kathaa_inputs[key].blobs.getSorted()
      sub_blob_raw = "";
      for(var _idx in sub_blobs){
        sub_blob_raw += sub_blobs[_idx]['value'] + "\n"
      }
      kathaa_outputs[out_key].set(blob_id, sub_blob_raw);
    }
    
    // Render new kathaaData in kathaa_outputs
    kathaa_outputs[out_key] = kathaa_outputs[out_key].render();
  }
  //passback computed results via callback
  done && done(null, kathaa_outputs);
}