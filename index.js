'use strict';

var ls = window.localStorage
  , safejson = require('safejson');


/**
 * Set a value in localStorage.
 * @param {String}
 * @param {String}
 * @param {Function}
 */
var set = exports.set = function (key, value, callback) {
  try {
    ls.setItem(key, value);
    callback(null);
  } catch (e) {
    callback(e);
  }
};


/**
 * Useful method for saving JSON data without needing to stringify.
 * @param {String}
 * @param {Object}
 * @param {Function}
 */
exports.setJson = function (key, json, callback) {
  safejson.stringify(json, function (err, str) {
    if (err) {
      callback(err);
    } else {
      set(key, str, callback);
    }
  });
};


/**
 * Get a value in localStorage.
 * @param {String}
 * @param {Function}
 */
var get = exports.get = function (key, callback) {
  // Pretty sure this doesn't throw, but let's be careful...
  try {
    callback(null, ls.getItem(key));
  } catch (e) {
    callback(e);
  }
};


/**
 * Useful method for getting JSON data directly as an object.
 * @param {String}
 * @param {Object}
 * @param {Function}
 */
exports.getJson = function (key, callback) {
  get(key, function (err, res) {
    if (err) {
      callback(err);
    } else {
      safejson.parse(res, callback);
    }
  });
};


/**
 * Remove an item from localStorage.
 * @param {String}
 * @param {Function}
 */
exports.remove = function (key, callback) {
  // Pretty sure this doesn't throw, but let's be careful...
  try {
    ls.removeItem(key);
    callback(null);
  } catch (e) {
    callback(e);
  }
};
