'use strict';

var LS = require('./lib/LocalStorage');

module.exports = new LS();

module.exports.getAdapter = function getAdapter (name) {
  return new LS(name);
};
