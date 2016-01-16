// imported libraries have to be imported in the
// global scope, so that user defined/user modified functions
// also have access to them
//
// example
// GLOBAL.hindi_panjabi_request = require('request');
//
// where "hindi_panjabi" is the namespace to avoid conflicts between different modules-groups

GLOBAL.hindi_panjabi_request = require('request');
GLOBAL.hindi_panjabi_Entities = require('html-entities').AllHtmlEntities;
GLOBAL.hindi_panjabi_entities = new GLOBAL.hindi_panjabi_Entities();
