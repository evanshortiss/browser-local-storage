'use strict';

var ls = window.localStorage
  , safejson = require('safejson')
  , events = require('events')
  , util = require('util');


/**
 * Object represnting possible events that istances will emit.
 * Each instance has this attached to it for accessibility.
 * @api public
 * @type {Object}
 */
var EVENTS = {
  SET: 'SET',
  SET_FAILED: 'SET_FAILED',
  GET: 'GET',
  GET_FAILED: 'GET_FAILED',
  REMOVE: 'REMOVE',
  REMOVE_FAILED: 'REMOVE_FAILED'
};


/**
 * Wrap an optional callback for safe execution.
 * Returns an empty callback if none is provided.
 * @param  {Function} [callback]
 * @return {Function}
 * @api private
 */
function wrapCallback (callback) {
  return callback || function () {};
}


/**
 * Generate a period separated storage key
 * @param  {String} ns  Namespace being used
 * @param  {String} key Actual key of the data
 * @return {String} The generated namespaced key
 * @api private
 */
function genStorageKey (ns, key) {
  return (ns === '') ? ns.concat(key) : ns.concat('.').concat(key);
}


/**
 * Class used to provide a wrapper over localStorage
 * @param {String} [ns] Optional namespace for the adpater.
 */
function LocalStorage (ns) {
  events.EventEmitter.call(this);

  this.ns = ns || '';

  if (typeof this.ns !== 'string') {
    throw new Error('Namespace must be a string.');
  }

  this.EVENTS = EVENTS;
}
util.inherits(LocalStorage, events.EventEmitter);
module.exports = LocalStorage;


/**
 * Get the namespace of the this LocalStorage object
 * @return {String} The namespace used to prefix all keys for this instance
 */
LocalStorage.prototype.getNs = function () {
  return this.ns;
};


/**
 * Set a value in localStorage.
 * @param {String}    key The under which data should be stored
 * @param {String}    value The value to store
 * @param {Function}  [callback] Optional callback for getting operation results
 */
LocalStorage.prototype.set = function (key, value, callback) {
  callback = wrapCallback(callback);

  try {
    ls.setItem(genStorageKey(this.getNs(), key), value);
    callback(null, null);
    this.emit(EVENTS.SET, key, value);
  } catch (e) {
    callback(e, null);
    this.emit(EVENTS.SET_FAILED, key, value);
  }
};


/**
 * Useful method for saving JSON data without needing to stringify.
 * @param {String} key The key to store data under
 * @param {Object} json The JSON object to store
 * @param {Function} [callback] Optional callback for getting operation results
 */
LocalStorage.prototype.setJson = function (key, json, callback) {
  var self = this;
  callback = wrapCallback(callback);

  safejson.stringify(json, function (err, str) {
    if (err) {
      callback(err, null);

      this.emit(EVENTS.SET_FAILED, key, json);
    } else {
      self.set(key, str, callback);
    }
  });
};


/**
 * Get a value from localStorage.
 * @param {String} key Key of the value to get
 * @param {Function} [callback] Optional callback for getting operation results
 */
LocalStorage.prototype.get = function (key, callback, silent) {
  callback = wrapCallback(callback);

  // Pretty sure this doesn't throw, but let's be careful...
  try {
    var item = ls.getItem(genStorageKey(this.getNs(), key));
    callback(null, item);

    if (!silent) {
      this.emit(EVENTS.GET, key, item);
    }
  } catch (e) {
    if (!silent) {
      this.emit(EVENTS.GET_FAILED, key);
    }
    callback(e, null);
  }
};


/**
 * Useful method for getting JSON data directly as an object.
 * @param {String} key Key of Object to retrieve
 * @param {Function} [callback] Optional callback used to get results.
 */
LocalStorage.prototype.getJson = function (key, callback) {
  callback = wrapCallback(callback);

  var self = this;

  this.get(key, function (err, res) {
    if (err) {
      callback(err, null);
      self.emit(EVENTS.GET_FAILED, key);
    } else {
      safejson.parse(res, function (err, res) {
        if (err) {
          callback(err, null);

          self.emit(EVENTS.GET_FAILED, key);
        } else {
          callback(null, res);

          self.emit(EVENTS.GET, key, res);
        }
      });
    }
  }, true);
};


/**
 * Remove an item from localStorage.
 * @param {String} key Key of the object to remove
 * @param {Function} [callback] Optional callback used to get results.
 */
LocalStorage.prototype.remove = function (key, callback) {
  callback = wrapCallback(callback);

  // Pretty sure this doesn't throw, but let's be careful...
  try {
    ls.removeItem(genStorageKey(this.getNs(), key));
    callback(null, null);
    this.emit(EVENTS.REMOVE, key);
  } catch (e) {
    callback(e, null);
    this.emit(EVENTS.REMOVE_FAILED, key);
  }
};
