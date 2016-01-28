var kathaaData = require('./kathaa-data')
var graph = function(_graph, kathaaResources){
  this.nodes = _graph.processes;
  this.edges = _graph.connections;

  // nodeMap is a lookup table to obtain the node object by node-id
  this.nodeMap = {}
  var node;
  for(var node_id in this.nodes){
    this.nodeMap[node_id] = this.nodes[node_id];
    node = this.nodeMap[node_id];
    node['id'] = node_id;

    // Deleting kathaa_inputs and kathaa_outputs
    // ensures, we take just the structure from the graph
    // Else the dependency resolution for future modules might get messed up
    // if their kathaa_inputs from any of the previous runs are used in thie graph
    delete node.kathaa_inputs;
    delete node.kathaa_outputs;

    // In case of kathaa_resource type of modules,
    // convert to kathaaData format and copy the kathaa_outputs if available
    // in kathaaResources
    if(kathaaResources[node.id]){
      node.kathaa_outputs = kathaaResources[node.id]
      for(var port in kathaaResources[node.id]){
        kathaaResources[node.id][port] = new kathaaData(kathaaResources[node.id][port]);
        this.set_outport_value(node.id, port, kathaaResources[node.id][port].render());
      }
    }
  }

  // Mark connection between nodes in the data structure
  var edge;
  var source, target;
  for(var _index in this.edges){
    edge = this.edges[_index];

    // Maintain a table of targets(children) in the node objects
    // key being the target id and the value being the edge object (which also contains the port information)
    source = this.nodes[edge.src.process];
    target = this.nodes[edge.tgt.process];

    if(source.children == undefined){
      source.children = {}
    }
    source.children[target.id] = edge;

    // Maintain a table of targets parents
    // This will be useful in case of modules which have
    // multiple dependencies.
    // Modules like that can be enqueud **only** after all their dependencies
    // are met.
    if(target.parents == undefined){
      target.parents = {}
    }
    // the key being the id of the parent node,
    // and the value being the corresponding edge object

    // One parent can have multiple edges
    if(target.parents[source.id]){
      target.parents[source.id].push(edge)      
    }else{
      target.parents[source.id] = [edge];
    }
  }


  // Validation Marker
  // TO-DO : Add a proper validation function
  this.isValid = true
}

graph.prototype.get_node = function(nodeId){
  return this.nodeMap[nodeId];
}

graph.prototype.set_inport_value = function(node_id, inport, value){
  var node;
  node = this.get_node(node_id);
  if(node.kathaa_inputs == undefined){
    node.kathaa_inputs = {}
  }
  node.kathaa_inputs[inport] = value;
}

graph.prototype.set_outport_value = function(node_id, outport, value){
  var node;
  node = this.get_node(node_id);

  if(node.kathaa_outputs == undefined){
    node.kathaa_outputs = {}
  }
  node.kathaa_outputs[outport] = value;
}

graph.prototype.get_outport_value = function(node_id, outport){
  var node;
  node = this.get_node(node_id);

  if(node.kathaa_outputs && (outport in node.kathaa_outputs)){
    return node.kathaa_outputs[outport];
  }
  return false;
}
graph.prototype.check_dependency_satisfied = function(node_id, module_library){
  var node = this.get_node(node_id);

  // When all inports are filled !!
  // When all parents have their corresponding edges satisfied
  var edge, edges, parent_port, outport_value, my_inport;
  for(var _parent_id in node.parents){
    for(var edge_idx in node.parents[_parent_id]){

      edge = node.parents[_parent_id][edge_idx];
      parent_port = edge.src.port;
      my_inport = edge.tgt.port;


      // NOTE :
      // Possible Heisenbug here
      // Fix This
      console.log("Time ::", process.hrtime());
      // console.log(edge);

      // if kathaa_output of parent is defined !!
      outport_value = this.get_outport_value(_parent_id, parent_port)    
      if(outport_value == false){
        return false;
      }

      // If they are satisfied, automatically keep computing
      // the kathaa_input inside the graph-level node instance
      this.set_inport_value(node_id, my_inport, outport_value);
    }
  }

  // Now check if all the (non-optional) inports of the said component
  // are represented in kathaa-input
  var inport;
  for(var _index in module_library.component_library[node.component].inports){
    inport = module_library.component_library[node.component].inports[_index];

    if(inport.optional){
      //this check can be ignored for optional ports
    }else{
      if(inport.name in node.kathaa_inputs){
      }else{
        return false;
      }
    }

  }
  return true;
}

module.exports = graph;

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
