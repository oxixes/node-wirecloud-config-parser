'use strict';

var fs = require('fs');
var libxml = require('libxmljs');
var request = require('request');
var parseString = require('xml2js').parseString;
var Promise = require('es6-promise');

function ConfigParser() {
    this.data = null;
    this.componentData = null;
};

ConfigParser.prototype = {
    setFile: function (configFile, callback) {
        return new Promise(function (resolve, reject) {
            // Read File
            fs.readFile(configFile, function (err, data) {
                if (err) {reject(err);}
                var xml = libxml.parseXml(data);

                // Get XSD schema
                request.get('https://raw.githubusercontent.com/Wirecloud/wirecloud/develop/src/wirecloud/commons/utils/template/schemas/xml_schema.xsd', function (err, response) {
                    if (err) {reject(err);}
                    var schema = libxmljs.parseXml(response.body);
                    var valid = validate(schema, xml);
                    if (!valid) {
                        reject(xml.validationErrors);
                    }

                    // Parse XML to JS object
                    parseString(data, function (err, data) {
                        if (err) {reject(err);}
                        this.data = data;
                        this.componentData = data[getType(data)];
                        resolve();
                    }
                });
            });
        });
    },
    getData: function () {
        return this.data;
    },
    getName: function () {
        return this.componentData.$.name;
    },
    getVendor: function () {
        return this.componentData.$.vendor;
    },
    getVersion: function () {
        return this.componentData.$.version;
    }
};

function validate(schema, data) {
    return data.validate(schema);
}

function getType (data) {
    switch (data) {
        case data.widget:
            return 'widget';
            break;
        case data.operator:
            return 'operator';
            break;
        case data.mashup:
            return 'mashup';
            break;
        default:
            return 'unknown';
    }
}

module.exports = ConfigParser;
