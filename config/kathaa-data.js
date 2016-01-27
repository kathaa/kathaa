/**
  * TO-DO : Add Documentation
  * TO-DO : Add a per-sentence state marker, to mark erroronous sentences?
  **/
var re = /<<<<<<<<<<<<<< KATHAA-DATA\((\d*\.?\d*)\)\n([\s\S]*?)\n>>>>>>>>>>>>>>\n/g

var kathaaData = function(_data){
  //Instantiate data variable
  if(_data == undefined){
    this.blobs = {}
  }else{
    this.blobs = {}

    // TO-DO Add a validation here
    while (match = re.exec(_data)) {
      this.set(match[1], match[2]);
    };
  }
}

kathaaData.prototype.getKeys = function(){
  return Object.keys(this.blobs)
}

kathaaData.prototype.get = function(key){
  return this.blobs[key+""];
}

kathaaData.prototype.set = function(key, value){
  this.blobs[key+""] = value.trim();
}

kathaaData.prototype.render = function(){
  // TO-DO This sorting function needs work, maybe a base-N system ?
  var sorted_keys = Object.keys(this.blobs).sort();
  var raw = "";
  for(var i=0; i<sorted_keys.length; i++){
      raw += "<<<<<<<<<<<<<< KATHAA-DATA("+sorted_keys[i]+")\n"
      raw += this.blobs[sorted_keys[i]+""];
      raw += "\n>>>>>>>>>>>>>>\n"
  }
  return raw
}

kathaaData.prototype.render_natural = function(_delim){
  // TO-DO This sorting function needs work, maybe a base-N system ?
  var sorted_keys = Object.keys(this.blobs).sort();
  var natural = "";
  for(var i=0; i<sorted_keys.length; i++){
      natural += this.blobs[sorted_keys[i]+""]+"\n";
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
