module.exports = function (kathaa_inputs, progress, done){
  var in_ssf = kathaa_inputs['in_ssf']

  var parsed_sentence = ssf.parse(in_ssf);
  var pos_sequence = "";
  var lex_sequence = "";
  var flattened_list_of_nodes = ssf.getAllNodes(parsed_sentence);
  
  var node;
  for(var idx in flattened_list_of_nodes){
    node = flattened_list_of_nodes[idx]
    lex_sequence += node.lex + "\n"
    pos_sequence += node.POS +"\n" 
  }
  
  var kathaa_outputs = {};
  kathaa_outputs['pos_sequence'] = pos_sequence;
  kathaa_outputs['lex_sequence'] = lex_sequence;
    
  done && done(null, kathaa_outputs);
}