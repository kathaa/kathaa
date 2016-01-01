var request = require('request');
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

var hindi_panjabi = function(){
}

hindi_panjabi.prototype.hindi_panjabi_tokenizer = function(job, progress, done){
  console.log("Inside tokenizer");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/1/1',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_utf2wx = function(job, progress, done){
  console.log("Inside utf2wx");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/2/2',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_morph = function(job, progress, done){
  console.log("Inside morph");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/3/3',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_postagger = function(job, progress, done){
  console.log("Inside postagger");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/4/4',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_chunker = function(job, progress, done){
  console.log("Inside chunker");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/5/5',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_pruning = function(job, progress, done){
  console.log("Inside pruning");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/6/6',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_guessmorph = function(job, progress, done){
  console.log("Inside guessmorph");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/7/7',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_pickonemorph = function(job, progress, done){
  console.log("Inside pickonemorph");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/8/8',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_computehead = function(job, progress, done){
  console.log("Inside computehead");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/9/9',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_computevibhakti = function(job, progress, done){
  console.log("Inside computevibhakti");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/10/10',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_parse = function(job, progress, done){
  console.log("Inside parse");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/11/11',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_root2infinity = function(job, progress, done){
  console.log("Inside root2infinity");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/12/12',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_transfergrammar = function(job, progress, done){
  console.log("Inside transfergrammar");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/13/13',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_wx2utf = function(job, progress, done){
  console.log("Inside wx2utf");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/14/14',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_lexicaltransfer = function(job, progress, done){
  console.log("Inside lexicaltransfer");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/15/15',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_transliterate = function(job, progress, done){
  console.log("Inside transliterate");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/16/16',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_agreementfeature = function(job, progress, done){
  console.log("Inside agreementfeature");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/17/17',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_vibhaktispliter = function(job, progress, done){
  console.log("Inside vibhaktispliter");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/18/18',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_interchunk = function(job, progress, done){
  console.log("Inside interchunk");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/19/19',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_intrachunk = function(job, progress, done){
  console.log("Inside intrachunk");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/20/20',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_agreementdistribution = function(job, progress, done){
  console.log("Inside agreementdistribution");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/21/21',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_defaultfeatures = function(job, progress, done){
  console.log("Inside defaultfeatures");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/22/22',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

hindi_panjabi.prototype.hindi_panjabi_wordgenerator = function(job, progress, done){
  console.log("Inside wordgenerator");
  //save computed output values

  request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded;charset=UTF-8'},
    url:     'http://api.ilmt.iiit.ac.in/hin/pan/23/23',
    body:    "input="+encodeURI(job.data.node.in_ssf)
  }, function(error, response, body){
    if (!error && response.statusCode == 200) {
      try{
        console.log(body);
        body = entities.decode(body);
        body = JSON.parse(body);
        //Assumes only one key is passed
        for(var _key in body){
          job.data.node.out_ssf = body[_key]
          done && done(null, job.data.node);
          return;
        }
      }catch(e){
        var err = new Error('Malformed reply from Sampark API Server');
        job.failed().error(err);
        done(err);
      }
    }else{
      var err = new Error('Sampark API Server non responsive');
      job.failed().error(err);
      done(err);
    }
  });
}

module.exports = hindi_panjabi;