'use strict';

module.exports.validateMainProperties = function(mainProperties) {
    if (
        validateName(mainProperties.name) &&
        validateVendor(mainProperties.vendor) &&
        validateVersion(mainProperties.version) &&
        validateSize(mainProperties.size) &&
        validateNamespace(mainProperties.xmlns)
    ) {
        return true;
    }
    return false;
};

function validateName(name) {
    if (!name || name.length === 0) {
        return false;
    }
    return true;
}

function validateVendor(vendor) {
    if (!vendor || vendor.length === 0) {
        return false;
    }
    return true;
}

function validateVersion(version) {
    if (!version || version.length === 0) {
        return false;
    }
    var re = /^([1-9]\d*\.|0\.)*([1-9]\d*|0)((a|b|rc)[1-9]\d*)?$/;
    return re.test(version);
}

function validateSize(size) {
    if (!size) {
        return true;
    }
    var re = /^\d+(\.\d+)?\s*(px|%)?$/;
    return re.test(size);
}

function validateNamespace(ns) {
    if (!ns || ns.length === 0) {
        return false;
    }
    var re = /^\c+:.+$/;
    re.test(ns);
}
