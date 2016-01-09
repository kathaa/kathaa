'use strict';

/**
 * Module dependencies.
 */

const env = process.env.NODE_ENV || 'development';

var jsonfile = require('jsonfile');
var util = require('util');
var utf8 = require('utf8');

/**
 * Expose
 */

module.exports = function () {

  //Load Module Libraries
  var file = __dirname+"/module_library/package.json";
  var module_package = jsonfile.readFileSync(file);
  var module_library = {}
  module_library.component_library = {}
  module_library.library_object = {}
  module_library.processes = {}
  module_library.process_definitions = {}

  module_package.files.forEach(function(element, index, array){
    jsonConcat(module_library.component_library, jsonfile.readFileSync(__dirname+"/module_library/"+element));

    var library_definition_file = element.split(".");
    library_definition_file.pop();
    library_definition_file.push("js");
    library_definition_file = library_definition_file.join(".");

    var library_definition = require(__dirname+"/module_library/"+library_definition_file);
    for(var _process in library_definition.prototype){
      module_library.processes[_process] = library_definition.prototype[_process];
      module_library.process_definitions[_process] = library_definition.prototype[_process].toString();
      module_library.library_object[_process] = library_definition;
    }
  })
  return module_library;
};

//Helper functions
function random_string(){
  return Math.random().toString(36).substring(7);
}

function jsonConcat(o1, o2) {
 for (var key in o2) {
  o1[key] = o2[key];
 }
 return o1;
}
