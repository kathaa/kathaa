GLOBAL.libxml = require("libxmljs");
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

/**
  * TO-DO : Add Documentation
  * TO-DO : Add a per-sentence state marker, to mark erroronous sentences?
  **/
DELIM = "  ";
var kathaaData = function(_data){
  //Instantiate data variable
  if(_data == undefined){
    this.blobs = {}
    this.blobs['kathaa-blobs'] = {}
  }else{
    // Assuming its type is libxmljs compatible XML string
    // TO-DO Add a validation here
    this.blobs = JSON.parse(_data.trim());
  }
}

kathaaData.prototype.getKeys = function(){
  return Object.keys(this.blobs['kathaa-blobs'])
}

kathaaData.prototype.getKeysSorted = function(){
  var split_x, split_y;
  return this.getKeys().sort(function(x, y){
    split_x = x.split(".").map(parseInt);
    split_y = y.split(".").map(parseInt);

    if(split_x)

    for(i in split_x.length>split_y.length?split_x:split_y){

      if(split_x[i] == undefined){
        split_x.push(0)
      }
      if(split_y[i] == undefined){
        split_y.push(0)
      }

      if(split_x[i] > split_y[i]){
        return 1;
      }else if(split_x[i] < split_y[i]){
        return -1;
      }
    }
    return 0;
  });
}

kathaaData.prototype.get = function(key){
  return this.blobs['kathaa-blobs'][key+""];
}

kathaaData.prototype.set = function(key, value){
  this.blobs['kathaa-blobs'][key+""] = value.trim();
}

kathaaData.prototype.render = function(){
  // console.log(entities.decode(this.blobs.toString()));
  // TO-DO : Fix this 
  // The rendered XML should have all the elements sorted properly
  // var _temp = new libxml.Document();
  // _temp.node('kathaa-blobs');

  // var sorted_keys = this.getKeysSorted()  
  // console.log(sorted_keys);

  // for(_idx in sorted_keys){
  //   _temp.get('//kathaa-blobs')
  //         .node('kathaa-blob', "\n"+this.get(sorted_keys[_idx])+"\n"+DELIM)
  //         .attr({id: sorted_keys[_idx]});
  // }

  // this.blobs = _temp;
  // return entities.decode(this.blobs.toString());
  return JSON.stringify(this.blobs, null, 4);
}

kathaaData.prototype.render_natural = function(_delim){
  if(_delim == undefined){
    _delim = "\n";
  }
  var natural = "";
  var keys = Object.keys(this.blobs['kathaa-blobs'])
  for(var idx in keys){
    natural += this.blobs['kathaa-blobs'][keys[idx]]+"\n"
  }
  return natural.trim()
}

kathaaData.prototype.trimLines = function(data){
  var split = data.split("\n");
  for(var i=0;i <split.length; i++){
    split[i] = split[i].trim();
  }
  return split.join('\n')
}

module.exports = kathaaData;
