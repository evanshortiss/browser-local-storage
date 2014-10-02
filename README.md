browser-ls
=======

browser-ls provides a nice node-like wrapper on the localStorage API in browsers. It 
handles potential localStorage exceptions for you, plus 
it's only 3KB minified!

It handles exceptions internally via try catch blocks and will return errors in 
the Node.js fashion of using the first callback parameter as an error argument.
This means it'll play nicely with other Node.js modules that are supported in 
the browser like Async.js.

## Install 

Via NPM: 

```
npm i browser-ls
```

Via Bower

```
bower i browser-ls
```

You can also just drop a file from the _dist/_ folder here into your project.


## Example


```javascript
var ls = require('browser-ls');

// If you're not Browserify-ing you can use:
// var ls = window.ls ;
// instead of "require"

ls.setJson('somejson', {
	name: 'Bruce Wayne',
	aka: 'Batman'
}, function (err) {
	if (err) {
		alert('Failed to write to localStorage');
	} else {
		ls.getJson('somejson', function(err, json) {
			if (err) {
				alert('Failed to get item from localStorage')
			} else {
				alert('We stored and retrieved JSON from localStorage!');
				alert('Result: ' + JSON.stringify(json));
			}
		});
	}
});

```

Because this module uses a standard Node callback pattern if you like neater 
code the above could be written like so:

```javascript
var async = require('async'),
	ls = require('browser-ls');

var STORAGE_KEY = 'somejson'

async.series({
	writeToLs: function (cb) {
		ls.setJson(STORAGE_KEY, {
			name: 'Bruce Wayne',
			aka: 'Batman'
		}, cb);
	}, 
	readFromLs: function (cb) {
		ls.getJson(STORAGE_KEY, cb);
	}
}, function (err, res) {
	if (err) {
		alert('Something went wrong...');
	} else {
		alert('We stored and retrieved JSON from localStorage!');
		alert('Result: ' + JSON.stringify(res.readFromLs));
	}
})
```

## Browser Support
I've tested this on the following browsers but it should work on pretty much 
any browser with _JSON_ and _localStorage_ support. 

* Safari 7.0.5
* Chrome 37.0.2062
* Firefox 29.0.0

If the awesome
[ci.testling](https://ci.testling.com/) service has the timeout issues it's 
recently experiencing resolved a more complete browser support matrix can be 
constructed then.


## API
All callbacks receive an error as the first parameter which will be null if no 
error occured. All methods that retreive an item take a second parameter that 
is the result.

#### set(key, string, callback)
Set a string value in localStorage.

#### setJson(key, object, callback)
Write a JSON object to localStorage.

#### get(key, callback)
Get a string value from localStorage.

#### getJson(key, callback)
Get an Object from localStorage.

#### remove(key, callback)
Remove an object from localStorage.

