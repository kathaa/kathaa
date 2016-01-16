// imported libraries have to be imported in the
// global scope, so that user defined/user modified functions
// also have access to them
//
// example
// GLOBAL.core_request = require('request');
//
// where "core" is the namespace to avoid conflicts between different modules-groups

// Only the SSF API gets to violate the namespacing convention,
// because well its cool -_- and because I wrote it -_- !!
//
GLOBAL.ssf = require('ssf-api');
