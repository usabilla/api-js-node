const istanbul = require('browserify-istanbul');
const isparta = require('isparta');

module.exports = function (config) {
  var base = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      'src/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['browserify'],
      'src/**/*.spec.js': ['browserify']
    },

    // configure browserify and babelify to use preset
    browserify: {
      debug: true,
      transform: [istanbul({
        instrumenter: isparta,
        ignore: ['**/node_modules/**', '**/*.spec.js']
      }), 'babelify']
    },

    // coverage reporter configuration
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {type: 'text-summary'},
        {type: 'html', subdir: 'html'}
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  };

  if (process.env.TRAVIS) {
    base.browsers = ['Chrome_travis_ci'];
    base.singleRun = true;
    base.autoWatch = false;
    base.coverageReporter.reporters.push({type: 'lcov', subdir: './'});
    base.reporters.push('coveralls');
  }

  config.set(base);
};
