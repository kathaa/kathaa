module.exports = function (kathaa_inputs, progress, done){
  //Populate kathaa_outputs object
  var kathaa_outputs = {};

  //Your Voodoo goes here
  var parsed_sentence = ssf.parse(kathaa_inputs['in_ssf'])
  kathaa_outputs['out'] = parsed_sentence.generateSentence();

  //passback computed results via callback
  done && done(null, kathaa_outputs);
}
