# Node Wirecloud Config Parser

Parser for a Wirecloud Mashable Application Component's config file.

## Getting started

This parser can be installed via npm with this command:

```shell
npm install wirecloud-config-parser --save
```

### Examples

This parser takes an xml Wirecloud config file and returns a javascript object containing all data in it.

#### Initialization

Before trying to get any data, the library must be imported and the parser object created:

```javascript
var Parser = require('wirecloud-config-parser');
var configParser = new Parser('parse/to/file');
```

#### Retrieve data

The data can be retrieved using the getData function:

```javascript
configParser.getData();
```

This function returns an object containing the config file data:

```javascript
{
    name: 'some-name',
    vendor: 'some-vendor',
    version: '0.0.1',
    type: 'widget'
}
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
