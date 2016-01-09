'use strict';

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/' + req.profile.id);
    }
    next();
  }
};

/*
 *  Graph authorization routing middleware
 */

exports.graph = {
  hasAuthorizationToView: function (req, res, next) {
    // if (req.graph.user.id != req.user.id) {
    //   req.flash('info', 'You are not authorized');
    //   return res.redirect('/graphs/' + req.graph.id);
    // }
    next();
  },
  hasAuthorizationToUpdate: function (req, res, next) {
    console.log(req.graph);
    console.log(req.user);

    if (req.graph.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/graphs/' + req.graph.id);
    }
    next();
  }
};
