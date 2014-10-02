!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ls=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"safejson":3}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
(function (process){
// Determines wether actions should be deferred for processing
exports.defer = false;


/**
 * Defer a function call momentairly.
 * @param {Function} fn
 */
function deferred(fn) {
  if (exports.defer === true) {
    process.nextTick(fn);
  } else {
    fn();
  }
}


/**
 * Stringify JSON and catch any possible exceptions.
 * @param {Object}    json
 * @param {Function}  [replacer]
 * @param {Number}    [spaces]
 * @param {Function}  callback
 */
exports.stringify = function (/*json, replacer, spaces, callback*/) {
  var args = Array.prototype.slice.call(arguments)
    , callback = args.splice(args.length - 1, args.length)[0];

  deferred(function() {
    try {
      return callback(null, JSON.stringify.apply(null, args));
    } catch (e) {
      return callback(e, null);
    }
  });
};


/**
 * Parse string of JSON and catch any possible exceptions.
 * @param {String}    json
 * @param {Function}  [reviver]
 * @param {Function}  callback
 */
exports.parse = function (/*json, reviver, callback*/) {
  var args = Array.prototype.slice.call(arguments)
    , callback = args.splice(args.length - 1, args.length)[0];

  deferred(function() {
    try {
      return callback(null, JSON.parse.apply(null, args));
    } catch (e) {
      return callback(e, null);
    }
  });
};
}).call(this,require('_process'))
},{"_process":2}]},{},[1])(1)
});