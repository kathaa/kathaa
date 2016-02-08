'use strict';

/**
 * Module dependencies.
 */

const env = process.env.NODE_ENV || 'development';

var fs = require('fs-extra');
var path = require('path');
var jsonfile = require('jsonfile');
var util = require('util');
var utf8 = require('utf8');
var marked = require('marked');

/**
 * Expose
 */

module.exports = function () {

  //Load Module Libraries
  var module_library_root = __dirname+"/../module_library";

  var file = module_library_root + "/package.json";
  var module_package = jsonfile.readFileSync(file);
  var module_library = {}
  module_library.component_library = {}
  module_library.library_object = {}
  module_library.processes = {}
  module_library.process_definitions = {}

  var namespace_directory ;
  var component_directory;
  var _process;


  for(var namespace in module_package['module-groups']){
    namespace_directory = path.join(module_library_root, namespace);

    // Import Global Libraries required by individual component-groups
    require(namespace_directory+"/libraries.js");

    fs.readdirSync(namespace_directory).filter(function(file) {
      return file != ".git" && fs.statSync(path.join(namespace_directory, file)).isDirectory();
    }).forEach(function(module, index, array){

      component_directory = path.join(namespace_directory, module);
      //Read JSON file
      try{
        var module_definition = jsonfile.readFileSync(path.join(component_directory, "package.json"));

        _process = namespace + "/" + module_definition['name'];
        module_definition['name'] = _process;

        //Collect Description
        module_definition['description'] = fs.readFileSync(path.join(component_directory, "description.md"), 'UTF-8');
        module_definition['short_description'] = module_definition['description'].length > 120 ? module_definition['description'].substring(0,120)+"...": module_definition['description'];

        module_definition['description'] = marked(module_definition['description']);

        // Modules of type : "kathaa-user-intervention" and "kathaa-resources" do not have a computing Process
        // associated with them
        // They in turn require the manual intervention of the user to continue
        //
        if(module_definition["type"] != "kathaa-user-intervention" &&
           module_definition["type"] != "kathaa-resources" ){

        //Collect Processes
        module_library.processes[_process] = require(path.join(component_directory, module_definition['main']))
        //Collect Process Definition
        module_library.process_definitions[_process] = module_library.processes[_process].toString();

        delete module_definition['main'];
        }

        //Add module library to component_library
        module_library.component_library[_process] = module_definition;

      }catch(err){
        //Pass Silently
        console.error(err);
      }
    });
  }
  return module_library;
};
