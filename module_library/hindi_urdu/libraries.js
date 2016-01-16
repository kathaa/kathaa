// imported libraries have to be imported in the
// global scope, so that user defined/user modified functions
// also have access to them
//
// example
// GLOBAL.hindi_urdu_request = require('request');
//
// where "hindi_urdu" is the namespace to avoid conflicts between different modules-groups

GLOBAL.hindi_urdu_request = require('request');
GLOBAL.hindi_urdu_Entities = require('html-entities').AllHtmlEntities;
GLOBAL.hindi_urdu_entities = new GLOBAL.hindi_urdu_Entities();
