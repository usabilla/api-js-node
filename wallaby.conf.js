const wallabify = require('wallabify');

module.exports = function(wallaby) {
  return {
    files: [
      {pattern: 'node_modules/babel-polyfill/dist/polyfill.js', instrument: false},
      {pattern: 'src/**/*.js', load: false}
    ],
    tests: [{pattern: 'test/**/*spec.js', load: false}],
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    postprocessor: wallabify(),
    setup: function() {
      // required to trigger tests loading
      window.__moduleBundler.loadTests();
    }
  };
};
