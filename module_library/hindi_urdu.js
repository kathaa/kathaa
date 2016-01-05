GLOBAL.hindi_urdu_request = require('request');
GLOBAL.hindi_urdu_Entities = require('html-entities').AllHtmlEntities;
GLOBAL.hindi_urdu_entities = new GLOBAL.hindi_urdu_Entities();

var hindi_urdu = function(){
}

hindi_urdu.prototype.hindi_urdu_tokenizer = function(kathaa_inputs, progress, done){
  console.log("Inside tokenizer");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/1/1',
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

hindi_urdu.prototype.hindi_urdu_utf2wx = function(kathaa_inputs, progress, done){
  console.log("Inside utf2wx");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/2/2',
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

hindi_urdu.prototype.hindi_urdu_morph = function(kathaa_inputs, progress, done){
  console.log("Inside morph");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/3/3',
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

hindi_urdu.prototype.hindi_urdu_postagger = function(kathaa_inputs, progress, done){
  console.log("Inside postagger");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/4/4',
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

hindi_urdu.prototype.hindi_urdu_pruning = function(kathaa_inputs, progress, done){
  console.log("Inside pruning");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/5/5',
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

hindi_urdu.prototype.hindi_urdu_pickonemorph = function(kathaa_inputs, progress, done){
  console.log("Inside pickonemorph");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/6/6',
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

hindi_urdu.prototype.hindi_urdu_chunker = function(kathaa_inputs, progress, done){
  console.log("Inside chunker");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/7/7',
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

hindi_urdu.prototype.hindi_urdu_multiwordexpr = function(kathaa_inputs, progress, done){
  console.log("Inside multiwordexpr");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/8/8',
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

hindi_urdu.prototype.hindi_urdu_ner = function(kathaa_inputs, progress, done){
  console.log("Inside ner");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/9/9',
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

hindi_urdu.prototype.hindi_urdu_merger = function(kathaa_inputs, progress, done){
  console.log("Inside merger");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/10/10',
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

hindi_urdu.prototype.hindi_urdu_headcomputation = function(kathaa_inputs, progress, done){
  console.log("Inside headcomputation");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/11/11',
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

hindi_urdu.prototype.hindi_urdu_wx2utf = function(kathaa_inputs, progress, done){
  console.log("Inside wx2utf");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/12/12',
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

hindi_urdu.prototype.hindi_urdu_lexicaltransfer = function(kathaa_inputs, progress, done){
  console.log("Inside lexicaltransfer");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/13/13',
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

hindi_urdu.prototype.hindi_urdu_transliterate = function(kathaa_inputs, progress, done){
  console.log("Inside transliterate");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/14/14',
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

hindi_urdu.prototype.hindi_urdu_utf2wx_urd = function(kathaa_inputs, progress, done){
  console.log("Inside utf2wx_urd");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/15/15',
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

hindi_urdu.prototype.hindi_urdu_agreementfeature = function(kathaa_inputs, progress, done){
  console.log("Inside agreementfeature");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/16/16',
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

hindi_urdu.prototype.hindi_urdu_interchunk = function(kathaa_inputs, progress, done){
  console.log("Inside interchunk");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/17/17',
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

hindi_urdu.prototype.hindi_urdu_intrachunk = function(kathaa_inputs, progress, done){
  console.log("Inside intrachunk");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/18/18',
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

hindi_urdu.prototype.hindi_urdu_defaultfeatures = function(kathaa_inputs, progress, done){
  console.log("Inside defaultfeatures");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/19/19',
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

hindi_urdu.prototype.hindi_urdu_wordgenerator = function(kathaa_inputs, progress, done){
  console.log("Inside wordgenerator");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/20/20',
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

hindi_urdu.prototype.hindi_urdu_wx2utf_urd = function(kathaa_inputs, progress, done){
  console.log("Inside wx2utf_urd");
  //save computed output values
  var kathaa_outputs = {}

  hindi_urdu_request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/urd/21/21',
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

module.exports = hindi_urdu;