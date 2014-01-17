module.exports = function (grunt) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    copy: {
      build: {
        nonull: true,
        cwd: 'app', //All src matches are relative to (but don't include) this path
        src: ['**', '!**/*.coffee'],
        dest: 'build',
        expand: true
      }
    },
    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/styles/**/*.min.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', 'build/scripts/*', '!build/scripts/**/*.min.js', '!build/scripts/vendor/**' ]
      }
    },
    cssmin: {
      options: {
        banner: '/* My minified css file */',
        keepSpecialComments: 0
      },
      build: {
        files: {
          'build/styles/app.min.css': [ 'app/**/*.css' ]
        }
      }
    },
    ngmin: {
      controllers: {
        expand: true, // Enable dynamic expansion.
        cwd: 'app',      // Src matches are relative to this path.
        src: [ 'scripts/controllers/**/*.js' ], // Actual pattern(s) to match.
        dest: 'build',   // Destination path prefix
        filter: 'isFile'
      },
      directives: {
        expand: true,
        cwd: 'app',
        src: ['scripts/directives/**/*.js'],
        dest: 'build',
        filter: 'isFile'
      },
      application: {
        expand: true,
        cwd: 'app',
        src: ['scripts/app.js'],
        dest: 'build',
        filter: 'isFile'
      }
    },
    uglify: {
      build: {
        options: {
          mangle: {
            except: ['jQuery', 'angular']
          }
        },
        files: {
          'build/scripts/application.min.js': [ 'build/scripts/app.js', 'build/scripts/controllers/main.js' ]
        }
      }
    },
    // Coffee to JS compilation. 'scripts/**/' tells recursively traverse all directories within the src directory
    coffee: {
      compile: {
        files: {
          'app/scripts/*.js': 'app/scripts/**/*.coffee',
          'test/spec/*.js': 'test/spec/**/*.coffee'
        }
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          css_dir: 'temp/styles',
          sass_dir: 'app/styles',
          images_dir: 'app/images',
          javascripts_dir: 'temp/scripts',
          force: true
        }
      }
    },

    // generate application cache manifest
    manifest: {
      generate: {
        options: {
          basePath: '../',
          cache: ['js/app.js', 'css/style.css'],
          network: ['http://*', 'https://*'],
          fallback: ['//offline.html'],
          exclude: ['scripts/vendor/angular.min.js'],
          preferOnline: true,
          verbose: true,
          timestamp: true,
          hash: true,
          master: ['index.html']
        },
        src: [
          'build/**/*.html',
          'build/scripts/*.min.js',
          'build/styles/*.css'
        ],
        dest: 'cache.manifest'
      }
    },
    // default watch configuration
    watch: {
      stylesheets: {
        files: 'app/styles/**/*.css',
        tasks: [ 'stylesheets' ]
      },
      scripts: {
        files: [ 'app/scripts/**/*.{coffee,js}', '!app/scripts/vendor/**' ],
        tasks: [ 'scripts' ]
      },
      copy: {
        files: [ 'app/**', '!app/scripts/**', '!app/styles/**' ],
        tasks: [ 'copy' ]
      },
      karma: {
        files: ['app/scripts/**/*.js', 'test/spec/**/*.js'],
        tasks: ['karma:unit:run']
      }
    },
    // specifying JSHint options and globals
    // https://github.com/gruntjs/grunt-contrib-jshint
    // http://www.2ality.com/2011/09/jshint.html
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        force: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        "globals": { //A map of global variables, with keys as names and a boolean value to determine if they are assignable
          "jQuery": false,
          "angular": false,
          "sampleYeomanAppApp": true
        }
      },
      files: {
        src: [ 'app/scripts/**/*.js', '!app/scripts/vendor/**' ]
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },
    // renames JS/CSS to prepend a hash of their contents for easier
    // version
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [
          {
            src: [
              'build/img/**/*.{jpg,jpeg,gif,png}',
              'build/fonts/**/*.{eot,svg,ttf,woff}'
            ]
          }
        ]
      }
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    usemin: {
      html: ['build/**/*.html'],
      options: {
        assetsDirs: [ 'build/img' ]
      }
    },

    // HTML minification
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [
          {
            expand: true, // Enable dynamic expansion.
            cwd: 'build/',      // Src matches are relative to this path.
            src: [ '**/*.html' ], // Actual pattern(s) to match.
            dest: 'build/',   // Destination path prefix
            filter: 'isFile'
          }
        ]
      }
    },

    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: 'build/',
            src: ['**/*.png'],
            // Could also match cwd line above. i.e. project-directory/img/
            dest: 'build/',
            // Instead of specifying ext, you can specify rename which is a function that lets you create your own mapping for the file names
            rename: function (dest, src) {
              return dest + src;
            }
          }
        ]
      },
      jpg: {
        options: {
          progressive: true
        },
        files: [
          {
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: 'build/',
            src: ['**/*.jpg'],
            // Could also match cwd. i.e. project-directory/img/
            dest: 'build/',
            ext: '.jpg'
          }
        ]
      }
    },
    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: 'build',
          hostname: '*'
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: true //The background option will tell grunt to run karma in a child process so it doesn't block subsequent grunt tasks
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // define the tasks
  grunt.registerTask(
    'stylesheets',
    'Compiles the stylesheets.',
    [ 'cssmin', 'clean:stylesheets' ]
  );

  grunt.registerTask(
    'scripts',
    'Compiles the JavaScript files.',
    [ 'coffee', 'jshint', 'ngmin', 'uglify', 'clean:scripts' ]
  );

  grunt.registerTask(
    'build',
    'Compiles all of the assets and copies the files to the build directory.',
    [ 'clean:build', 'copy', 'rev', 'usemin', 'imagemin', 'htmlmin', 'stylesheets', 'scripts' ]
  );

  grunt.registerTask('devmode', ['karma:unit', 'connect', 'watch']);
};
