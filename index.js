'use strict';

var LS = require('./lib/LocalStorage')
  , adapters = {};

module.exports = new LS();

module.exports.getAdapter = function getAdapter (name) {
  if (adapters[name]) {
    return adapters[name];
  } else {
    adapters[name] = new LS(name);
    return adapters[name];
  }
};
