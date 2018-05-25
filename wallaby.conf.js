module.exports = function() {
  return {
    files: ['lib/**/*.js', 'package.json', 'lib/endpoints.json'],

    tests: ['test/**/*.spec.js'],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest'
  };
};
