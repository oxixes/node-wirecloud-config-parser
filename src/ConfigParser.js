'use strict';

var fs = require('fs');
var parseString = require('xml2js').parseString;

function ConfigParser() {};

ConfigParser.prototype = {
    setFile: function (configFile) {
        fs.readFile(configFile, function (err, data) {
            if (err) {
                throw err;
            }
            parseString(data, function (err, data) {
                if (err) {
                    throw err;
                }
                switch (data) {
                    case data.widget:
                        this.data = data.widget;
                        break;
                    case data.operator:
                        this.data = data.operator;
                        break;
                    case data.mashup:
                        this.data = data.mashup;
                    default:

                }
            });
        });
    },
    getData: function () {
        return this.data;
    },
    getName: function () {
        return this.data.$.name;
    },
    getVendor: function () {
        return this.data.$.vendor;
    },
    getVersion: function () {
        return this.data.$.versions;
    },
    check: function () {

    }

};

module.exports = ConfigParser;
