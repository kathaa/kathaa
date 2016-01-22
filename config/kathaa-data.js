var re = /<<<<<<<<<<<<<< KATHAA-DATA\((\w+)\)\n([\s\S]*?)\n>>>>>>>>>>>>>>\n/g

/**
  * TO-DO : Add Documentation
  * TO-DO : Add a per-sentence state marker, to mark erroronous sentences?
  **/

var kathaaData = function(_data){
  //Instantiate data variable
  this.data = {}

  while (match = re.exec(_data)) {
    this.set(match[1], match[2]);
  };
}

kathaaData.prototype.get = function(key){
  if(typeof key=="number"){
    key = key+"";
  }else if(typeof key == "string" && Number(key)){
    //Good to go
  }else{
    var error = new Error("Unsupported Data-Key in Katha-Data. Only Numerical Values are supported")
  }

  return this.data[key];
}

kathaaData.prototype.getKeys = function(){
  return Object.keys(this.data).map(function (element) {
                                              return parseInt(element, 10);
                                            }).sort(function(a,b){
                                              return a-b;
                                            });
}

kathaaData.prototype.set = function(key, value){
  if(typeof key=="number"){
    key = key+"";
  }else if(typeof key == "string" && Number(key)){
    //Good to go
  }else{
    var error = new Error("Unsupported Data-Key in Katha-Data. Only Numerical Values are supported")
  }

  this.data[key] = value.trim();
}

kathaaData.prototype.render = function(){
  var sorted_keys = Object.keys(this.data).map(function (element) {
                                              return parseInt(element, 10);
                                            }).sort(function(a,b){
                                              return a-b;
                                            });
  var raw = "";
  for(var i=0; i<sorted_keys.length; i++){
      raw += "<<<<<<<<<<<<<< KATHAA-DATA("+sorted_keys[i]+")\n"
      raw += this.data[sorted_keys[i]+""];
      raw += "\n>>>>>>>>>>>>>>\n"
  }
  return raw
}

kathaaData.prototype.trimLines = function(data){
  var split = data.split("\n");
  for(var i=0;i <split.length; i++){
    split[i] = split[i].trim();
  }
  return split.join('\n')
}

module.exports = kathaaData;
