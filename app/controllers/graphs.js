'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const assign = require('object-assign');
const wrap = require('co-express');
const only = require('only');
const Graph = mongoose.model('Graph');
const file_handler = require('../../config/file_handler');

/**
 * Load
 */

exports.load = wrap(function* (req, res, next, id) {
  req.graph = yield Graph.load(id);
  if (!req.graph) return next(new Error('Graph not found'));
  next();
});

/**
 * List
 */

exports.index = wrap(function* (req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const limit = 16;
  const options = {
    limit: limit,
    page: page
  };

  const graphs = yield Graph.list(options);
  const count = yield Graph.count();

  res.render('graphs/index', {
    title: 'Graphs',
    graphs: graphs,
    page: page + 1,
    pages: Math.ceil(count / limit)
  });
});

/**
 * New graph
 */

exports.new = function (req, res){
  res.render('graphs/new', {
    title: 'New Graph',
    graph: new Graph({}),
    graphView: true
  });
};

/**
 * Create an graph
 * Upload an image
 */

exports.create = wrap(function* (req, res) {
  console.log("Inside Create !!");
  const graph = new Graph(only(req.body, 'name body'));
  graph.user = req.user;

  // Saves the Snapshot PNG in /public/snapshots folder with
  // the graph-id as its name.
  if(req.body.snapshot){
    file_handler.save_base64_png( 'snapshot', graph.id+".png",
                                  req.body.snapshot,
                                  function(){
                                  })
  }

  if(req.body.isForked){
    //Update
    var parentGraph = yield Graph.load(
            mongoose.Types.ObjectId(req.body.parentGraph)
          )
    graph.parentGraph = parentGraph;
    yield graph.uploadAndSave();
    req.flash('success', 'Successfully forked graph!');
  }else{
    yield graph.uploadAndSave();
    req.flash('success', 'Successfully created graph!');
  }

  res.redirect('/graphs/' + graph._id);
});

/**
 * Edit an graph
 */

exports.edit = function (req, res) {
  console.log("Inside edit !!");
  res.render('graphs/edit', {
    title: 'Edit ' + req.graph.name,
    graph: req.graph,
    graphView: true
  });
};

/**
 * Update graph
 */

exports.update = wrap(function* (req, res){
  const graph = req.graph;

  // Saves the Snapshot PNG in /public/snapshots folder with
  // the graph-id as its name.
  if(req.body.snapshot){
    file_handler.save_base64_png( 'snapshot', graph.id+".png",
                                  req.body.snapshot,
                                  function(){
                                  })
  }

  assign(graph, only(req.body, 'name body'));
  yield graph.uploadAndSave();
  res.redirect('/graphs/' + graph._id);
});

/**
 * Show
 */

exports.show = function (req, res){
  if(req.graph.user.id == req.user.id){
    // If the user has the right to edit the graph,
    // redirect him to the edit page directly
    res.redirect('/graphs/'+req.graph.id+"/edit");
  }else{
    res.render('graphs/show', {
      name: req.graph.name,
      graph: req.graph,
      forkable: true,
      graphView: true
    });
  }
};

/**
 * Delete an graph
 */

exports.destroy = wrap(function* (req, res) {
  yield req.graph.remove();

  //Delete Snapshot
  file_handler.delete_file('snapshot', req.graph.id+".png", function(){});

  req.flash('success', 'Deleted successfully');
  res.redirect('/graphs');
});
