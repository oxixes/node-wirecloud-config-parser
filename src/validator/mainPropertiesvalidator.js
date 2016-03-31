'use strict';

module.exports.validateMainProperties = function(mainProperties) {
    return validateName(mainProperties.name) &&
        validateVendor(mainProperties.vendor) &&
        validateVersion(mainProperties.version) &&
        validateSize(mainProperties.size) &&
        validateNamespace(mainProperties.xmlns);
};

function validateName(name) {
    return name && name.length !== 0;
}

function validateVendor(vendor) {
    return vendor && vendor.length !== 0;
}

function validateVersion(version) {
    var re = /^([1-9]\d*\.|0\.)*([1-9]\d*|0)((a|b|rc)[1-9]\d*)?$/;
    return version && version.length !== 0 && re.test(version);
}

function validateSize(size) {
    var re = /^\d+(\.\d+)?\s*(px|%)?$/;
    return re.test(size) || !size;
}

function validateNamespace(ns) {
    var re = /^\c+:.+$/;
    return ns && ns.length !== 0 && re.test(ns);
}
