'use strict';

var mainPropsVal = require('./mainPropertiesValidator');
var detailsVal = require('./detailsValidator');
var preferencesVal = require('./preferencesValidator');
var wiringVal = require('./wiringValidator');

module.exports.validate = function (data) {
    var type = getType(data);
    var specData = data[getType(data)];

    if (
        type !== 'unknown' &&
        mainPropsVal.validateMainProperties(specData.$) &&
        detailsVal.validateDetails(specData.details) &&
        preferencesVal.validatePreferences(specData.preferences) &&
        wiringVal.validateWiring(specData.wiring)
    ) {
        return true;
    }
    return false;
};

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
