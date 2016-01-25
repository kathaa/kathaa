module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  var in_ssf_1 = ssf.parse(kathaa_inputs['in_ssf_1']);
  var in_ssf_2 = ssf.parse(kathaa_inputs['in_ssf_2']);

  var in_ssf_1_nodes = ssf.getAllNodes(in_ssf_1);
  var in_ssf_2_nodes = ssf.getAllNodes(in_ssf_2);

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

  function throwError(message){
  	var err = new Error(message);
    done && done(err);
  }

  if(in_ssf_1_nodes.length != in_ssf_2_nodes.length){
	throwError("Both the SSF files appear very different(the number of nodes vary), please modify this module to suit the type of sentences you are providing this module");
  }else{
  	for(var idx in in_ssf_2_nodes.length){
    	if(in_ssf_1_nodes[idx].lex != in_ssf_2_nodes[idx].lex){
			throwError("Both the SSF files appear very different(the lexical item doesnt match), please modify this module to suit the type of sentences you are providing this module");
        }else{
        	in_ssf_1_nodes[idx].__attributes  = mergeObjects(
              	in_ssf_1_nodes[idx].__attributes,
                in_ssf_2_nodes[idx].__attributes
              );
            in_ssf_1_nodes[idx].POS = in_ssf_1_nodes[idx].POS;
        }
    }
  }


  kathaa_outputs['out_ssf'] = in_ssf_1.printSSFValue();
  //passback computed results via callback
  done && done(null, kathaa_outputs);
}
