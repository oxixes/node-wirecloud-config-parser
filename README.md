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

Before trying to get any data, the library must be imported and the parser object created. There are two ways of creating a parser object. One is to pass a path as parameter to the constructor and the parser will read and parse the file indicated by the path:

```javascript
var Parser = require('wirecloud-config-parser');
var configParser = new Parser('path/to/file');
```

And the other is to give it an options object where you can specify either a path or directly the contents of a config file, as well as an option to validate the xml while building the object:

```javascript
var Parser = require('wirecloud-config-parser');
var content = fs.readFileSync('path/to/file').toString();
var configParser = new Parser({content: content, validate: true});
```
>**NOTE:** If you give both the path and  the content options in the object the parser will read from the file given in the path

#### Validate

Whether you have validated the XML content while building the object or not, you can use the validate function later to test if the XML complies with [Wirecloud's schema](https://raw.githubusercontent.com/Wirecloud/wirecloud/master/src/wirecloud/commons/utils/template/schemas/xml_schema.xsd):

```javascript
configParser.validate();
// it should return true or false
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
