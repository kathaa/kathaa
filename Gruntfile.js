(function() {
  "use strict";
  module.exports = function() {

    var banner =
      "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %> (<%= grunt.template.date('longTime') %>)\n"+
      "* Copyright (c) <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>; Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n";

    var sources = {
      scripts: ['Gruntfile.js', 'public/the-*/*.js', 'public/the-*/*.html'],
      // elements: ['the-*/*.html'],
      stylus: ['public/themes/*/*.styl'],
      css: ['pubclic/themes/*.css']
    };

    var glob = require('glob');
    var stylExpand = glob.sync('public/themes/*.styl').join(' ');

    this.initConfig({
      pkg: this.file.readJSON('package.json'),
      'bower-install-simple': {
        deps: {
          options: {
            interactive: true,
            forceLatest: false,
            directory: 'public/bower_components'
          }
        }
      },
      exec: {
        build_stylus: {
          command: 'node ./node_modules/stylus/bin/stylus -c ' + stylExpand
        },
        build_fa: {
          command: 'node ./scripts/build-font-awesome-javascript.js'
        }
      },
      browserify: {
        libs: {
          files: {
            'public/build/noflo.js': ['public/index.js'],
          },
          options: {
            transform: ['coffeeify']
          },
          browserifyOptions: {
            require: 'noflo'
          }
        }
      },
      jshint: {
        options: {
          extract: 'auto',
          strict: true,
          newcap: false,
          "globals": { "Polymer": true }
        },
        all: {
          src: sources.scripts
        },
        force: {
          src: sources.scripts,
          options: { force: true }
        }
      }
    });

    this.loadNpmTasks('grunt-bower-install-simple');
    this.loadNpmTasks('grunt-exec');
    this.loadNpmTasks('grunt-browserify');

    this.registerTask('build', ['bower-install-simple', 'exec:build_stylus', 'exec:build_fa', 'browserify:libs']);
  };

}).call(this);
