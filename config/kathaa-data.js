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
    this.blobs = new libxml.Document();
    this.blobs.node('kathaa-blobs')
  }else{
    // Assuming its type is libxmljs compatible XML string
    // TO-DO Add a validation here
    this.blobs = libxml.parseXmlString(_data.trim());
  }
}

kathaaData.prototype.getKeys = function(){
  var blobs = this.blobs.find('kathaa-blob');
  var keys = [];
  for(var idx in blobs){
    keys.push(blobs[idx].attr('id').value());
  }
  return keys;
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

  //TO-DO : This is a rather hacky way to do this.
  // The issue arises because using the .text() functions strips out the inner tags
  // Should find a way for a .innerHtml eequivalent
  var _t = this.blobs.get("//kathaa-blob[@id='"+key+"']").toString().trim().split("\n");
  return _t.slice(1, _t.length-1).join("\n")
}

kathaaData.prototype.set = function(key, value){
  var blob = this.blobs.get("//kathaa-blob[@id='"+key+"']")
  if(blob){
    blob.text("\n"+value.trim()+"\n"+DELIM);
  }else {
    var newBlob = this.blobs.get('//kathaa-blobs')
                      .node('kathaa-blob', "\n"+value.trim()+"\n"+DELIM)
                      .attr({id: key});
  }
}

kathaaData.prototype.render = function(){
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
  return entities.decode(this.blobs.toString());
}

kathaaData.prototype.render_natural = function(_delim){
  if(_delim == undefined){
    _delim = "\n";
  }
  var natural = "";
  var blobs = this.blobs.find('kathaa-blob');
  for(var idx in blobs){
    natural += blobs[idx].text().trim()+_delim;
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
