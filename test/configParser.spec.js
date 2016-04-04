'use strict';

var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
var request = require('request');
var sinon = require('sinon');
var libxml = require('libxmljs');
var parseString = require('xml2js').parseString;
var ConfigParser = require('../src/ConfigParser');
var fs = require('fs');

chai.use(chaiAsPromised);

describe('Config Parser', function () {
    var configParser, schema, validConfig, invalidConfig;

    before(function () {
        validConfig = fs.readFileSync('test/fixtures/validConfig.xml').toString();
        schema = fs.readFileSync('test/fixtures/schema.xsd').toString();
    });

    beforeEach(function () {
        configParser = new ConfigParser();
        sinon.stub(request, 'get', function (obj, func) {func(null, {statusCode: 200}, schema);});
        sinon.stub(fs, 'readFile', function (file, cb) {cb(null, validConfig);});
    });

    afterEach(function () {
        request.get.restore();
    });

    it('should set the given config file', function () {
        var result = configParser.setFile('test/fixtures/validConfig.xml');
        expect(result).to.eventually.equal("ok");
    });
});
