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
        if (xml2js.parseString.restore) {
            xml2js.parseString.restore();
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
