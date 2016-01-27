/**
  * TO-DO : Add Documentation
  * TO-DO : Add a per-sentence state marker, to mark erroronous sentences?
  **/
var re = /<<<<<<<<<<<<<< KATHAA-DATA\((\d*\.?\d*)\)\n([\s\S]*?)\n>>>>>>>>>>>>>>\n/g
var kathaa_nested_blobs = require('./kathaa-nested-blobs');

var kathaaData = function(_data){
  //Instantiate data variable
  if(_data == undefined){
    this.blobs = new kathaa_nested_blobs();
  }else{
    this.blobs = new kathaa_nested_blobs();

    // TO-DO Add a validation here
    while (match = re.exec(_data)) {
      this.set(match[1], match[2]);
    };
  }
}

kathaaData.prototype.getAllBlobs = function(){
  return this.blobs.getSorted();
}

kathaaData.prototype.getAllBlobsDict = function(){
  var keys = {};
  var blobs = this.getAllBlobs();
  for(var idx in blobs){
    keys[blobs[idx]['key']] = blobs[idx]['value'];
  }
  return keys;
}

kathaaData.prototype.get = function(key){
  return this.blobs.get(key+"");
}

kathaaData.prototype.set = function(key, value){
  this.blobs.set(key+"",value.trim());
}

kathaaData.prototype.render_partial = function(blobs){
  var sorted_blobs = blobs.getSorted();
  var raw = "";
  for(var i=0; i<sorted_blobs.length; i++){
      raw += "<<<<<<<<<<<<<< KATHAA-DATA("+sorted_blobs[i]['key']+")\n"
      raw += sorted_blobs[i]['value'];
      raw += "\n>>>>>>>>>>>>>>\n"
  }
  return raw
}

kathaaData.prototype.render = function(){
  return this.render_partial(this.blobs);
}

kathaaData.prototype.render_natural = function(_delim){
  var sorted_blobs = this.blobs.getSorted();
  var natural = "";
  for(var i=0; i<sorted_blobs.length; i++){
      natural += sorted_blobs[i]['value']+"\n";
  }
  return natural
}

kathaaData.prototype.trimLines = function(data){
  var split = data.split("\n");
  for(var i=0;i <split.length; i++){
    split[i] = split[i].trim();
  }
  return split.join('\n')
}

module.exports = kathaaData;

// Test
// var data = new kathaaData();
// data.set(0, 'Test1');
// data.set(0.6, 'Test1');
// data.set(0.3, 'Test1');

// console.log(data.render());