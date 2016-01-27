var kathaa_nested_blobs = function(keys, value, rootKey){
  
  if(rootKey == undefined){
    rootKey = ''
  }

  this.children = {}
  if(keys != undefined){
    this.set(keys, value, rootKey);    
  }
}

kathaa_nested_blobs.prototype.set = function(keys, value, rootKey){
  if(rootKey == undefined){
    rootKey = ''
  }

  keys = keys.trim().split(".");

  //Exits on 1 as [].join(".").split(".") => ['']
  if(keys.length == 1 && keys[0].length == 0){
    this.blob_data = value;
    this.blob_key = rootKey + "." + keys[0];
    this.blob_key = this.blob_key.slice(1, this.blob_key.length-1)
  }else{
    var _key = keys[0];
    keys = keys.slice(1, keys.length)
    // keys.splice(0, keys.length);


    if(this.children[_key]){
      this.children[_key].set(keys.join("."), value, rootKey +"." + _key);
    }else{
      this.children[_key] = new kathaa_nested_blobs(keys.join("."), value, rootKey +"." + _key);  
    }
  }
}

kathaa_nested_blobs.prototype.get = function(keys){
  keys = keys.trim().split(".")

  //Exits on 1 as [].join(".").split(".") => ['']
  if(keys.length == 1 && keys[0].length == 0){
    return this.blob_data;
  }else{
    var _key = keys[0];
    keys = keys.slice(1, keys.length)
    // keys.splice(0, keys.length);


    if(this.children[_key]){
      return this.children[_key].get(keys.join("."));
    }else{
      return false
      // TO-DO Add error here
      //this.children[_key] = new kathaa_nested_blobs(keys.join("."), value);      
    }
  }
}

kathaa_nested_blobs.prototype.getObject = function(keys){
  keys = keys.trim().split(".")

  //Exits on 1 as [].join(".").split(".") => ['']
  if(keys.length == 1 && keys[0].length == 0){
    return this;
  }else{
    var _key = keys[0];
    keys = keys.slice(1, keys.length)
    // keys.splice(0, keys.length);


    if(this.children[_key]){
      return this.children[_key].get(keys.join("."));
    }else{
      return false
      // TO-DO Add error here
      //this.children[_key] = new kathaa_nested_blobs(keys.join("."), value);      
    }
  }
}

kathaa_nested_blobs.prototype.getChildren = function(keys){
  keys = keys.trim().split(".")

  //Exits on 1 as [].join(".").split(".") => ['']
  if(keys.length == 1 && keys[0].length == 0){
    var _temp = {};
    if(this.blob_key){
      _temp[this.blob_key] = this.children;
      return _temp;
    }
    return undefined;
  }else{
    var _key = keys[0];
    keys = keys.slice(1, keys.length)

    if(this.children[_key]){
      return this.children[_key].getChildren(keys.join("."));
    }else{
      return false
      // TO-DO Add error here
      //this.children[_key] = new kathaa_nested_blobs(keys.join("."), value);      
    }
  }
}

kathaa_nested_blobs.prototype.getSorted = function(namespace){
  if(Object.keys(this.children).length == 0){
    return  [ { 
                'key'   : namespace == undefined ? this.blob_key : namespace+"."+this.blob_key, 
                'value' : this.blob_data
              }
            ];
  }

  var results = []
  
  if(this.blob_key){
    results = results.concat([ { 
                    'key'   : namespace == undefined ? this.blob_key : namespace+"."+this.blob_key, 
                    'value' : this.blob_data
                  }
                ])
    }

  var keys = Object.keys(this.children).map(function(x) { return parseInt(x, 10); }).sort();
  var partial;
  for(var _key in keys){
    results = results.concat(this.children[keys[_key+""]].getSorted(namespace));
  }

  return results;
}

function mergeObjects(_o1, _o2){
    if(_o2 == undefined && _o1 != undefined){
        return _o1;
    }
    if(_o1 == undefined && _o2 != undefined){
        return _o2;
    }
    if(_o1 == undefined && _o2 == undefined){
        return {}
    }
    //Copy all _o2 keys into _o1
    for(var _key in _o2){
        _o1[_key] = _o2[_key];
    }
    return _o1;
}

module.exports = kathaa_nested_blobs;

// Test
// var blob = new kathaa_nested_blobs('0.1.2.3.4', 'hello');
// var blob = new kathaa_nested_blobs();
// blob.set('0.1.2.3.5', 'test1')
// blob.set('0.1.2', 'test123213')
// blob.set('9', 'test4343543')
// blob.set('','TEST');

// console.log(JSON.stringify(blob, null, 4));
// // console.log(blob.get('0.1.2'));
// console.log(blob.getSorted());