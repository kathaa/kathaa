'use strict';

/**
 * Module dependencies
 */

const inquirer = require('inquirer');
const fs = require('fs');
const join = require('path').join;
const mongoose = require('mongoose');
const config = require('../config/config');
const randomstring = require("randomstring");

const models = join(__dirname, '../app/models');


// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)));


const User = mongoose.model('User');
const Graph = mongoose.model('Graph');



function connect () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  return mongoose.connect(config.db, options).connection;
}

var db = connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);


var questions = [
  {
    name: "username",
    message: "Enter the user name for the Admin user",
    default: "admin"
  },
  {
    name: "email",
    message: "Enter the email of the Admin user",
    default: "admin@kathaa.ltrc.iiit.ac.in"
  },
  {
    name: "name",
    message: "Enter the Name of the Admin user",
    default: "Admin"
  },
  {
    type: "password",
    name: "password",
    message: "Enter the password for the Admin user (leave blank for random password generation)",
    default: ""
  },
  {
    type: "password",
    name: "password_reenter",
    message: "Please re-enter the password for the Admin user (leave blank for random password generation)",
    default: ""
  }
]

function ask(answers){
  if(answers.password.trim()==""){
    answers.password = randomstring.generate();
    answers.password_reenter = answers.password;
    console.log("Genrating password for the Admin user....");
  }
  if(answers.password != answers.password_reenter){
    console.log("Passwords do not match......please run the script again...");
  }

  var user_params = {
    name : answers.name,
    username: answers.username,
    password: answers.password,
    email: answers.email
  }

  const user = new User(user_params);
  user.provider = 'local';
  user.role = 'Admin';
  console.log("Attempting to create Admin user with params....")
  console.log(user_params);

  user.save(function(err){
    if(err){
      console.error("Unable to save the user...");
      console.error(err);
    }else{
      console.log("Successfully created Admin user.");
      seedDatabase(user);
    }
  });

}

function listen () {
  //Ask for admin user params
  inquirer.prompt(questions, ask);
}


function seedDatabase(user){
  var seedFiles = fs.readdirSync("./scripts/seed")
    .filter(file => ~file.indexOf('.json'));

  var processingStatus = {};
  seedFiles.forEach(function(fileName){
    processingStatus[fileName] = false;
  })
  function checkProcessingStatus(){
    for(var _index in processingStatus){
      if(processingStatus[_index] == false){
        return false;
      }
    }
    return true;
  }
    seedFiles.forEach(function(fileName){
      var file = fs.readFile("./scripts/seed/"+fileName, 'utf8',function(err, graphData){
        var graph_params = {
          name: fileName.replace(/\.[^/.]+$/, ""),
          body: graphData,
        }
        var graph = new Graph(graph_params);
        graph.user = user;

        graph.save(function(err){
          if(err){
            console.log("Unable to save graph from the file :", fileName);
            console.log(err);
          }else{
            console.log("Successfully saved graph from the file : ",fileName);
          }

          processingStatus[fileName] = true;
          if(checkProcessingStatus()){
            db.close();
            process.exit(0);
          }
        })
    })
  });
}
