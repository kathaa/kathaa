'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const notify = require('../mailer');

// const Imager = require('imager');
// const config = require('../../config/config');
// const imagerConfig = require(config.root + '/config/imager.js');

const Schema = mongoose.Schema;


/**
 * Graph Schema
 */

const GraphSchema = new Schema({
  name: { type : String, default : '', trim : true },
  body: { type : String, default : '', trim : true },
  user: { type : Schema.ObjectId, ref : 'User' },
  parentGraph: {type:Schema.ObjectId, ref: 'Graph' },
  createdAt  : { type : Date, default : Date.now }
});

/**
 * Validations
 */

GraphSchema.path('name').required(true, 'Graph name cannot be blank');
GraphSchema.path('body').required(true, 'Graph body cannot be blank');

/**
 * Pre-remove hook
 */

GraphSchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'graph');

  next();
});

/**
 * Methods
 */

GraphSchema.methods = {

  /**
   * Save graph and upload image
   *
   * @param {Object} images
   * @api private
   */

  uploadAndSave: function () {
    const err = this.validateSync();
    if (err && err.toString()) throw new Error(err.toString());
    return this.save();

    /*
    if (images && !images.length) return this.save();
    const imager = new Imager(imagerConfig, 'S3');

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err);
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files };
      }
      self.save(cb);
    }, 'graph');
    */
  },
};

/**
 * Statics
 */

GraphSchema.statics = {

  /**
   * Find graph by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      .populate('user', 'name email username parentGraph')
      .exec();
  },

  /**
   * List graphs
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

mongoose.model('Graph', GraphSchema);
