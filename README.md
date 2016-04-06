# Node Wirecloud Config Parser

Parser for a Wirecloud Mashable Application Component's config file.

## Getting started

This parser can be installed via npm with this command:

```shell
npm install node-wirecloud-config-parser --save
```

### Examples

This parser takes an xml Wirecloud config file and returns a javascript object containing all data in it.

#### Initialization

Before trying to get any data, the library must be imported and the parser object created and initialized with the setFile function:

```javascript
var ConfigParser = require('node-wirecloud-config-parser');
var configParser = new ConfigParser();
var promise = setFile('path/to/file');
```

#### Retrieve data

The data can be retrieved using the getData function or one of the specific field getters (e.g. getName). These functions must always be executed after the setFile promise has been resolved or else it will throw a missing data exception. To ensure this, proceed as follows:

```javascript
var data = promise.then(configParser.getData.bind(configParser));
```

Or, in a more readable way:

```javascript
promise.then(function () {
    var data = configParser.getData();
});
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
