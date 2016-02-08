'use strict';

/**
 * Module dependencies.
 */

const env = process.env.NODE_ENV || 'development';
const Git = require("nodegit");
const path = require('path');
const fs = require('fs-extra');
const pace = require('pace')(100);


/**
 * Expose
 */

module.exports = function(module_groups, module_library_root, callback) {
  var sync_complete = {};
  var sync_started = {};

  function sync_module_repo(repo_list, callback, retrying){
    // Exit Condition
    if(repo_list.length == 0){
      console.log("\n");
      return callback();
    }

    var repo = repo_list.pop();
    // Clone the particular module into module_library_root
    // TO-DO : Add different boundary cases here
    if(!retrying){
      console.log("==========================================================")
      console.log("Syncing  kathaa-module-group '"+repo['namespace']+"' from : "+repo['repository']);
    }

    Git.Clone(repo['repository'], path.join(module_library_root, repo['namespace']),
      {
        fetchOpts: {
          callbacks: {
            certificateCheck: function() {
              // github will fail cert check on some OSX machines
              // this overrides that check
              return 1;
            },
            credentials: function(url, userName) {
                return Git.Cred.sshKeyFromAgent(userName);
            },
            transferProgress: function(info) {
              // pace = pace || info.receivedObjects()/info.totalObjects();
              // if(info.totalObjects() != pace.total){
              // }
              // console.log(pace.total, info.totalObjects());
              if(info.totalObjects() > info.receivedObjects()){
                if(!sync_started[repo['repository']]){
                  console.log("\n");
                  sync_started[repo['repository']] = true;
                }else{
                  pace.op(info.receivedObjects());
                }
                pace.total = info.totalObjects();
              }else if(info.totalObjects() == info.receivedObjects()){
                if(!sync_complete[repo['repository']]){
                  pace.total = info.totalObjects();
                  pace.op(info.receivedObjects());
                }
                sync_complete[repo['repository']] = true;

              }
            }
          }
        }
      })
      .then(function(repository){
        // TO-DO : Handle moving to different tags at this point
        sync_module_repo(repo_list, callback);
      },
      function(error){
        if(error){
          //TO-DO: Handle repository already exists error here
          // console.log(error);

          // For now, delete the repo folder
          // and retry the whole step
          // console.log("Deleting already existing repository at : "+path.join(module_library_root, repo['namespace']));
          fs.removeSync(path.join(module_library_root, repo['namespace']));
          repo_list.push(repo);
          sync_module_repo(repo_list, callback, true);
        }
      });
  }

  var module_groups_as_array = [];
  for(var namespace in module_groups){
    module_groups_as_array.push({'namespace': namespace, 'repository': module_groups[namespace]});
  }

  sync_module_repo(module_groups_as_array, callback);
};
