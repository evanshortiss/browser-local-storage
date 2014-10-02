'use strict';

module.exports = function(config) {
  config.set({

    frameworks: ['mocha', 'chai'],

    files: [
      './dist/ls.js',
      './tests/*.js'
    ],

    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: 'INFO',
    captureTimeout: 60000,

    autoWatch: false,

    browsers: ['Chrome', 'Safari', 'Firefox'],

    singleRun: true
  });
};
