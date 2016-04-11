'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var libxml = require('libxmljs');
var ConfigParser = require('../src/ConfigParser');
var fs = require('fs');
global.request = require('sync-request');

describe('Config Parser', function () {

    describe('Read and parse', function () {

        it('should build a parser object that reads and parses the config file', function () {
            var parser = new ConfigParser('test/fixtures/validConfig.xml');
            expect(parser.data).not.to.be.undefined;
        });

        it('should fail to read a config file if it does not exist', function () {
            var failContructor = function () {
                return new ConfigParser('test/fixtures/inexistentFile.xml');
            };
            expect(failContructor).to.throw(Error, 'ENOENT: no such file or directory');
        });

        it('should fail to parse a syntactically incorrect config file', function () {
            var failContructor = function () {
                return new ConfigParser('test/fixtures/syntacticallyIncorrect.xml');
            };
            expect(failContructor).to.throw(Error, 'Start tag expected, \'<\' not found');
        });

        it('should read the contents of a file if they are passed in the options object', function () {
            var content = fs.readFileSync('test/fixtures/validConfig.xml').toString();
            var parser = new ConfigParser({content: content});
            expect(parser.data).not.to.be.undefined;
        });

        // The file passed in content is syntactically incorrect so if there is no exception thrown
        // the parser read the file in the path
        it('should use the path instead of the content within the options object', function () {
            var content = fs.readFileSync('test/fixtures/syntacticallyIncorrect.xml').toString();
            var constructor = function () {
                new ConfigParser({path: 'test/fixtures/validConfig.xml', content: content});
            };
            expect(constructor).not.to.throw(Error, 'Start tag expected, \'<\' not found');
        });
    });

    describe('Validate', function () {

        it('should validate a valid config file', function () {
            var parser = new ConfigParser('test/fixtures/validConfig.xml');
            expect(parser.validate()).to.equal(true);
        });

        it('should not validate an invalid config file', function () {
            var parser = new ConfigParser('test/fixtures/invalidConfig.xml');
            expect(parser.validate()).to.equal(false);
        });

        it('should validate the config file when building the object', function () {
            var spy = sinon.spy(ConfigParser.prototype, 'validate');
            var parser = new ConfigParser({path: 'test/fixtures/validConfig.xml', validate: true});
            expect(spy.called).to.equal(true);
        });

        it('should fail to parse the schema if it is syntactically incorrect', function () {
            sinon.stub(libxml, 'parseXml').onCall(1).throws(new Error());
            var parser = new ConfigParser('test/fixtures/validConfig.xml');
            expect(parser.validate.bind(parser)).to.throw(Error);
            libxml.parseXml.restore();
        });

        it('should throw an error if the config is detected as invalid while building', function () {
            var badConstructor = function () {
                return new ConfigParser({path: 'test/fixtures/invalidConfig.xml', validate: true});
            };
            expect(badConstructor).to.throw(Error, 'Validation Error: Invalid config.xml file');
        });
    });

    describe('Data', function () {
        it('should get all required data', function () {
            var expectedData = {
                name: 'detailimage-widget',
                vendor: 'UPM-ETSIINF',
                version: '0.6.0',
                type: 'widget'
            };
            var parser = new ConfigParser('test/fixtures/validConfig.xml');
            var actualData = parser.getData();
            expect(actualData.name).to.equal(expectedData.name);
            expect(actualData.vendor).to.equal(expectedData.vendor);
            expect(actualData.version).to.equal(expectedData.version);
            expect(actualData.type).to.equal(expectedData.type);
        });
    });

});
