'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var request = require('request');
var sinon = require('sinon');
var libxml = require('libxmljs');
var xml2js = require('xml2js');
var ConfigParser = require('../src/ConfigParser');
var fs = require('fs');
var DATA_NOT_AVAILABLE_ERROR = 'No data available. Please set the config file using the set file function';

chai.use(chaiAsPromised);

describe('Config Parser', function () {
    var configParser, schema, validConfig, invalidConfig, mashupConfig, operatorConfig;

    before(function () {
        validConfig = fs.readFileSync('test/fixtures/validConfig.xml').toString();
        invalidConfig = fs.readFileSync('test/fixtures/invalidConfig.xml').toString();
        mashupConfig = fs.readFileSync('test/fixtures/mashupConfig.xml').toString();
        operatorConfig = fs.readFileSync('test/fixtures/operatorConfig.xml').toString();
        schema = fs.readFileSync('test/fixtures/schema.xsd').toString();
    });

    beforeEach(function () {
        configParser = new ConfigParser();
        sinon.stub(request, 'get', function (obj, func) {func(null, {statusCode: 200}, schema);});
    });

    afterEach(function () {
        request.get.restore();
        fs.readFileSync.restore();
    });

    describe('Set file', function () {

        afterEach(function () {
            if (xml2js.parseString.restore) {
                xml2js.parseString.restore();
            }
            if (libxml.parseXml.restore) {
                libxml.parseXml.restore();
            }
        });

        it('should set the given config file', function () {
            sinon.stub(fs, 'readFileSync', function () {return validConfig;});
            var result = configParser.setFile('test/fixtures/validConfig.xml');
            expect(result).to.be.resolved;
        });

        it('should not set the file if there is an error reading the file', function () {
            sinon.stub(fs, 'readFileSync', function () {throw 'ENOENT';});
            var result = configParser.setFile('test/fixtures/validConfig.xml');
            expect(result).to.be.rejectedWith('ENOENT');
        });

        it('should not set the file if there is an error parsing the schema', function () {
            sinon.stub(fs, 'readFileSync', function () {return validConfig;});
            sinon.stub(libxml, 'parseXml').onCall(1).throws('Error');
            var result = configParser.setFile('test/fixtures/validConfig.xml');
            expect(result).to.be.rejectedWith('Error');
        });

        it('should not set the file if there is an error getting the schema', function () {
            var error = {error: 'There has been an error'};
            sinon.stub(fs, 'readFileSync', function () {return validConfig;});
            request.get.restore();
            sinon.stub(request, 'get', function (obj, func) {func(error, {statusCode: 200}, schema);});

            var result = configParser.setFile('test/fixtures/validConfig.xml');
            expect(result).to.be.rejectedWith(error);
        });

        it('should not set the file if the xml is not valid', function () {
            sinon.stub(fs, 'readFileSync', function () {return invalidConfig;});
            var result = configParser.setFile('test/fixtures/invalidConfig.xml');
            expect(result).to.be.rejectedWith('Invalid config file');
        });

        it('should not set the file if there is an error parsing the xml to a js object', function () {
            var error = {error: 'There has been an error'};
            sinon.stub(fs, 'readFileSync', function () {return validConfig;});
            sinon.stub(xml2js, 'parseString', function (obj, cb) {cb(error, {});});

            var result = configParser.setFile('test/fixtures/validConfig.xml');
            expect(result).to.be.rejectedWith(error);
        });

        it('should set the file with a mashup config file', function () {
            sinon.stub(fs, 'readFileSync', function () {return mashupConfig;});
            var result = configParser.setFile('test/fixtures/mashupConfig.xml');
            expect(result).to.eventually.be.resolved;
        });

        it('should set the file with an operator config file', function () {
            sinon.stub(fs, 'readFileSync', function () {return operatorConfig;});
            var result = configParser.setFile('test/fixtures/operatorConfig.xml');
            expect(result).to.eventually.be.resolved;
        });
    });

    describe('Getters', function () {
        var configData;
        before(function (done) {
            xml2js.parseString(validConfig, function (err, data) {
                configData = data;
                done();
            });
        });

        beforeEach(function () {
            sinon.stub(fs, 'readFileSync', function () {return validConfig;});
        });

        it('should get all data from config file', function () {
            var data = configParser.setFile('test/fixtures/validConfig.xml').then(configParser.getData.bind(configParser));
            expect(data).to.eventually.equal(configData);
        });

        it('should fail to get all data if data is not available', function () {
            expect(configParser.getData.bind(configParser)).to.throw(DATA_NOT_AVAILABLE_ERROR);
        });

        it('should get the the component\'s name', function () {
            var name = configParser.setFile('test/fixtures/validConfig.xml').then(configParser.getName.bind(configParser));
            expect(name).to.eventually.equal(configData.widget.$.name);
        });

        it('should fail to get the component\'s name if data is not available', function () {
            expect(configParser.getName.bind(configParser)).to.throw(DATA_NOT_AVAILABLE_ERROR);
        });

        it('should get the the component\'s vendor', function () {
            var vendor = configParser.setFile('test/fixtures/validConfig.xml').then(configParser.getVendor.bind(configParser));
            expect(vendor).to.eventually.equal(configData.widget.$.vendor);
        });

        it('should fail to get the component\'s vendor if data is not available', function () {
            expect(configParser.getVendor.bind(configParser)).to.throw(DATA_NOT_AVAILABLE_ERROR);
        });

        it('should get the the component\'s version', function () {
            var version = configParser.setFile('test/fixtures/validConfig.xml').then(configParser.getVersion.bind(configParser));
            expect(version).to.eventually.equal(configData.widget.$.version);
        });

        it('should fail to get the component\'s version if data is not available', function () {
            expect(configParser.getVersion.bind(configParser)).to.throw(DATA_NOT_AVAILABLE_ERROR);
        });
    });


});
