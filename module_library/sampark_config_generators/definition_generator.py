#!/usr/bin/env python

pipeline_name = "hindi_urdu";

template = """
   "%s/%s":{
      "name":"hindi_urdu/%s",
      "description":"%s description",
      "version":"v0.1",
      "icon":"legal",
      "inports":[
         {
            "name":"in_ssf",
            "type":"all"
         }
      ],
      "outports":[
         {
            "name":"out_ssf",
            "type":"all"
         }
      ],
      "metadata":{
         "label":"%s"
      }
   },"""

modules = ["tokenizer","utf2wx","morph","postagger","pruning","pickonemorph","chunker","multiwordexpr","ner","merger","headcomputation","wx2utf","lexicaltransfer","transliterate","utf2wx_urd","agreementfeature","interchunk","intrachunk","defaultfeatures","wordgenerator","wx2utf_urd"]

s = "{";
for m in modules:
  s+= template % (pipeline_name, m,m,m,m)

s=s[:-1]
s+="}"

print s

import json
parsed = json.loads(s);
s = json.dumps(parsed, indent=4)

f = open("component_definition.json","w")
f.write(s)
f.close();


template = """
%s.prototype.%s = function(job, progress, done){
  console.log("Inside %s");
  //save computed output values
  job.data.node.out_ssf = job.data.node.in_ssf+"::%s"
  done && done(null, job.data.node);
}
"""

"""
// Imported libraries
// GLOBAL.hindi_urdu_request = require('request');
// 
hindi_urdu.prototype.hindi_urdu_tokenizer = function(job, progress, done){
  console.log("Inside tokenizer");
  //save computed output values
  job.data.node.out_ssf = job.data.node.in_ssf+"::tokenizer"

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/1/1',
    body:    "input="+job.data.node.in_ssf;
  }, function(error, response, body){
    job.data.node.out_ssf = body["tokenizer"+"-1"]
    done && done(null, job.data.node);
  });
}
"""
local_server = "http://localhost:3000"
ilmt_server = "http://api.ilmt.iiit.ac.in"

sampark_template = """
%s.prototype.%s = function(kathaa_inputs, progress, done){
  console.log("Inside %s");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     '%s/hin/urd/%s/%s',
    body:    "input="+encodeURI(kathaa_inputs['in_ssf'])
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = hindi_urdu_entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          kathaa_outputs['out_ssf'] = body[_key];
          done && done(null, kathaa_outputs);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      done(err);
    }
  });
//
// 
// Available external libraries 
// 
// GLOBAL.hindi_urdu_request = require('request');
// GLOBAL.hindi_urdu_Entities = require('html-entities').AllHtmlEntities;
// GLOBAL.hindi_urdu_entities = new GLOBAL.hindi_urdu_Entities();
}
"""

s =  "GLOBAL.hindi_urdu_request = require('request');\n"
s += "GLOBAL.hindi_urdu_Entities = require('html-entities').AllHtmlEntities;\n"
s += "GLOBAL.hindi_urdu_entities = new GLOBAL.hindi_urdu_Entities();\n"

s += """
var """+pipeline_name+""" = function(){
}
"""

count = 1
for m in modules:
  s+= sampark_template % (pipeline_name, 
                  pipeline_name+"_"+m,
                  m,
                  ilmt_server,
                  count,
                  count
                  )
  count += 1

s+= """
module.exports = """+pipeline_name+";"

print s

f = open("process_definition.js","w")
f.write(s)
f.close();

