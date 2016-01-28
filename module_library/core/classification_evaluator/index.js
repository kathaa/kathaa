module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  //Your Voodoo goes here
  var true_labels = kathaa_inputs['true_labels'];
  var predicted_labels = kathaa_inputs['predicted_labels'];

  true_labels = true_labels.split("\n");
  predicted_labels = predicted_labels.split("\n");

  if(true_labels.length != predicted_labels.length){
    var err = new Error("The total number of True Labels do not match the total number of Predicted Labels");
    done(err);
  }

  var confusion_matrix = function(){
  this.classDict = {}
  this.matrix = {}
  }
  confusion_matrix.prototype.add_data_point = function(true_label, predicted_label){
    this.classDict[true_label] = true
    this.classDict[predicted_label] = true

    
    if(this.matrix[true_label+"_"+predicted_label] == undefined){
      this.matrix[true_label+"_"+predicted_label] = 1
    }else{
      this.matrix[true_label+"_"+predicted_label] += 1
    }
  }

  confusion_matrix.prototype.get = function(true_label, predicted_label){
      return this.matrix[true_label+"_"+predicted_label] == undefined ? 0 : this.matrix[true_label+"_"+predicted_label];
  }

  confusion_matrix.prototype.render = function(){
    output = "";
    classes = Object.keys(this.classDict).sort();

    var output = "\t";
    for(var idx in classes){
      output += classes[idx]+"\t";
    }
    output += "\n"
    for(var idx_x in classes){
      var line = classes[idx_x]+"\t|"
      for(var idx_y in classes){
        line += this.get(classes[idx_x], classes[idx_y])+"\t|"
      }
      line += "\n"
      output += line;
    }

    return output;
  }

  var _confusion_matrix = new confusion_matrix();

  for(var idx=0; idx < true_labels.length; idx++){
    _confusion_matrix.add_data_point(true_labels[idx], predicted_labels[idx]);
  }

  kathaa_outputs['evaluation_result'] = _confusion_matrix.render();
  //passback computed results via callback
  done && done(null, kathaa_outputs);
}