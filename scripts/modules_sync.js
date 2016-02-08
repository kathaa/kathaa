var kathaa_module_sync = require('../config/kathaa-module-group-sync');
var jsonfile = require('jsonfile');
var path = require('path');

var module_lib_root = path.join(__dirname, "..", "module_library");
var package_file = path.join(__dirname, "..", "package.json");
var package_json = jsonfile.readFileSync(package_file);

console.log("Installing Kathaa-Module-Groups...........");
kathaa_module_sync(package_json['kathaa-module-groups'], module_lib_root, function(){
  console.log("Kathaa Modules Installed........");
})
