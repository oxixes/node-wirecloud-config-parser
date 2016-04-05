'use strict';

var fs = require('fs');
var libxml = require('libxmljs');
var request = require('request');
var xml2js = require('xml2js');
var Promise = require('es6-promise').Promise;
var SCHEMA_URL = 'https://raw.githubusercontent.com/Wirecloud/wirecloud/develop/src/wirecloud/commons/utils/template/schemas/xml_schema.xsd';

function validate(schema, data) {
    return data.validate(schema);
}

function getType (data) {
    var result;
    if(data.widget) {
        result = 'widget';
    } else if (data.operator) {
        result = 'operator';
    } else {
        result = 'mashup';
    }
}

function validateXml(xml) {
    return new Promise(function (resolve, reject) {
        request.get(SCHEMA_URL, function (err, response, body) {
            if (err) {
                reject(err);
                throw err;
            }
            var schema;
            try {
                schema = libxml.parseXml(body);
            } catch (e) {
                reject(e);
                throw e;
            }
            if (!validate(schema, xml)) {
                reject('Invalid config file');
                throw xml.validationErrors;
            }
            resolve();
        });
    });
}

function parse2js(configData) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(configData, function (err, data) {
            if (err) {
                reject(err);
                throw err;
            }
            this.data = data;
            this.componentData = data[getType(data)];
            resolve();
        }.bind(this));
    }.bind(this));
}

function ConfigParser() {
    this.data = null;
    this.componentData = null;
}

ConfigParser.prototype = {
    setFile: function (configFile) {
        return new Promise(function (resolve, reject) {
            var configData, xml;
            try {
                configData = fs.readFileSync(configFile).toString();
                xml = libxml.parseXml(configData);
            } catch (e) {
                reject(e);
                throw e;
            }
            validateXml(xml)
                .then(parse2js.bind(this, configData))
                .catch(reject);
        }.bind(this));
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

module.exports = ConfigParser;
