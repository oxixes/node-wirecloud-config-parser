'use strict';

var fs = require('fs');
var parseString = require('xml2js').parseString;
var validator = require('./validator/validator');

function ConfigParser() {};

ConfigParser.prototype = {
    setFile: function (configFile) {
        fs.readFile(configFile, function (err, data) {
            if (err) {throw err;}
            parseString(data, function (err, data) {
                if (err) {throw err;}
                if (!validator.validate(data)) {
                    throw 'Invalid config.xml structure';
                }
                this.componentData = data[validator.getType(data)];
                this.data = data;
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

module.exports = ConfigParser;
