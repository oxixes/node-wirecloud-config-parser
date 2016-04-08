'use strict';

var fs = require('fs');
var libxml = require('libxmljs');
var request = require('sync-request');
var SCHEMA_URL = 'https://raw.githubusercontent.com/Wirecloud/wirecloud/master/src/wirecloud/commons/utils/template/schemas/xml_schema.xsd';

function ConfigParser(configFile, validate) {
    var configData;
    try {
        configData = fs.readFileSync(configFile).toString();
        this.data = libxml.parseXml(configData);
    } catch (e) {
        throw e;
    }

    if (validate && !this.validate()) {
        throw new Error('Validation Error: Invalid config.xml file');
    }
}

ConfigParser.prototype.validate = function () {
    var res = request('GET', SCHEMA_URL);
    var body = res.getBody();
    var schema;
    try {
        schema = libxml.parseXml(body);
    } catch (e) {
        throw e;
    }

    return this.data.validate(schema);
};

ConfigParser.prototype.getData = function (configFile) {
    return {
        name: this.data.root()._attr('name').value(),
        vendor: this.data.root()._attr('vendor').value(),
        version: this.data.root()._attr('version').value(),
        type: this.data.root().name()
    };
};

module.exports = ConfigParser;
