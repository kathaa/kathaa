/**
  * Note : This is a dev-mode script used to "convert" the module library from
  * the previous format to the current format. This is not required for
  * the functioning of the Kathaa Framework.
  * This is left here as a reference for future design changes to module structures
  *
  * This script has to be used in conjunction with
  * the corresponding `.js` and `.json` files from the previous module_library
  * 
  **/

var fs = require('fs-extra');
var jsonfile = require('jsonfile');
var path = require('path');

//core
var name = "core"

var libs = ["core", "hindi_panjabi", "hindi_urdu"];
for(var i in libs){
  name = libs[i];

  var _structure = name+".json"
  var _procedure = "./"+name+".js"


  var structure = jsonfile.readFileSync(_structure)
  var procedure = require(_procedure);

  //Remove Directory
  fs.removeSync(name);
  //Create New Directory
  fs.mkdirsSync(name);

  //Create a Folder by the name if it doesnot exists
  for(var key in structure){
    var _key = key.replace(name+"/","");
    var key_folder = name + "/" + _key;

    //create directory for the key
    fs.mkdirsSync(key_folder);

    structure[key]['name'] = structure[key]['name'].replace(name+"/","");

    structure[key]['main'] = "index.js"

    var description = structure[key]['description']
    delete (structure[key]['description']);

    //Create Corresponding JSON file
    fs.writeFileSync(path.join(key_folder+"/package.json"), JSON.stringify(structure[key], null, 4))
    fs.writeFileSync(path.join(key_folder+"/description.md"), description);
    fs.writeFileSync(path.join(key_folder+"/index.js"), "module.exports = "+procedure.prototype[name+"_"+_key].toString());

    console.log(key);
  }

}
