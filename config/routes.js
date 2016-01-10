'use strict';

/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

const users = require('../app/controllers/users');
const graphs = require('../app/controllers/graphs');
const auth = require('./middlewares/authorization');
const config = require('./config');

/**
 * Route middlewares
 */

const graphAuthView   = [auth.requiresLogin, auth.graph.hasAuthorizationToView];
const graphAuthUpdate = [ auth.requiresLogin,
                          auth.graph.hasAuthorizationToView,
                          auth.graph.hasAuthorizationToUpdate]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  // Allow User creations only if the user allows in the config file
  if(config.allow_user_creation){
    app.get('/signup', users.signup);
    app.post('/users', users.create);
  }
  app.get('/logout', users.logout);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.load);

  // Graph routes
  app.param('id', graphs.load);
  app.get('/graphs', auth.requiresLogin, graphs.index);
  app.get('/graphs/new', auth.requiresLogin, graphs.new);
  app.post('/graphs', auth.requiresLogin, graphs.create);
  app.get('/graphs/:id', auth.requiresLogin, graphs.show);
  app.get('/graphs/:id/edit', graphAuthUpdate, graphs.edit);
  app.put('/graphs/:id', graphAuthUpdate, graphs.update);
  app.delete('/graphs/:id', graphAuthUpdate, graphs.destroy);


  // home route
  app.get('/', graphs.index);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
