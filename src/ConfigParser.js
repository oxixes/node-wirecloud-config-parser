'use strict';

var fs = require('fs');
var libxml = require('libxmljs2');
var request = require('sync-request');
var SCHEMA_URL = 'https://raw.githubusercontent.com/Wirecloud/wirecloud/master/src/wirecloud/commons/utils/template/schemas/xml_schema.xsd';

function getContent(path) {
    try {
        return fs.readFileSync(path).toString();
    } catch (e) {
        throw e;
    }
}

ConfigParser.prototype.parseContent = function (content) {
    try {
        this.type = "json";
        return JSON.parse(content);
    } catch (e) {
        // If it's not JSON, try parsing it as XML
        try {
            this.type = "xml";
            return libxml.parseXml(content);
        } catch (e) {
            throw new Error('Invalid config file format');
        }
    }
}

function ConfigParser(options) {
    if (typeof options === 'string') {
        options = { path: options };
    }

    var content = options.path ? getContent(options.path) : options.content;
    this.data = this.parseContent(content);
    if (!this.validate()) {
        throw new Error('Validation Error: Invalid config.xml file');
    }
}

ConfigParser.prototype.validate = function () {
    if (this.type === "xml") {
        var res = request('GET', SCHEMA_URL);
        var body = res.getBody();
        var schema;
        try {
            schema = libxml.parseXml(body);
        } catch (e) {
            throw e;
        }

        return this.data.validate(schema);
    }
    else if (this.type === "json") {
        try {
            this.validateJson(body);
            return true;
        }
        catch (e) {
            throw e;
        }
    }

};

function checkArrayFields(fields, place, required = false) {
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    for (let field of fields) {
        if (place[field] === undefined) {
            if (required) {
                throw new TemplateParseException(`Missing required field: ${field}`);
            }

        } else if (!Array.isArray(place[field])) {
            throw new TemplateParseException(`An array value was expected for the ${field} field`);
        }
    }
}

function checkStringFields(fields, place, required = false, allowNull = false) {
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    for (let field of fields) {
        if (place[field] === undefined) {
            if (required) {
                throw new TemplateParseException(`Missing required field: ${field}`);
            }

        } else if (typeof place[field] !== 'string') {
            if (allowNull && place[field] === null) {
                continue;
            }
            throw new TemplateParseException(`A string value was expected for the ${field} field`);
        }
    }
}

function checkBooleanFields(fields, place, required = false) {
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    for (let field of fields) {
        if (place[field] === undefined) {
            if (required) {
                throw new TemplateParseException(`Missing required field: ${field}`);
            }
        } else if (typeof place[field] !== 'boolean') {
            throw new TemplateParseException(`A boolean value was expected for the ${field} field`);
        }
    }
}

function checkIntegerFields(fields, place, required = false, allowCast = false) {
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    for (let field of fields) {
        if (place[field] === undefined) {
            if (required) {
                throw new TemplateParseException(`Missing required field: ${field}`);
            }

        } else if (typeof place[field] !== 'number' || !Number.isInteger(place[field])) {
            if (allowCast) {
                try {
                    place[field] = parseInt(place[field]);
                } catch (e) {
                    throw new TemplateParseException(`An integer value was expected for the ${field} field`);
                }
            } else {
                throw new TemplateParseException(`An integer value was expected for the ${field} field`);
            }
        }
    }
}

function checkBehaviourViewFields(data) {
    checkComponentInfo(data, 'operator');
    checkComponentInfo(data, 'widget');
    checkArrayFields('connections', data, false);
    for (let connection of data['connections']) {
        checkStringFields(['sourcename', 'targetname'], connection, true);
        checkConnectionHandles(connection);
    }
}

function checkContactsFields(fields, place, required = false) {
    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    for (let field of fields) {
        if (place[field] === undefined) {
            if (required) {
                throw new TemplateParseException(`Missing required field: ${field}`);
            }

            place[field] = [];
        } else if (typeof place[field] === 'string' || Array.isArray(place[field]) || place[field] instanceof Tuple) {
            
        } else {
            throw new TemplateParseException(`${field} field must be a list or string`);
        }
    }
}

function checkContentsField(data, alternative = true) {
    if (typeof data === 'object' && data !== null) {
        checkStringFields('src', data, true);
        checkStringFields('contenttype', data, false, 'text/html');
        checkStringFields('charset', data, false, 'utf-8');

        if (alternative === true) {
            checkStringFields('scope', data, true);
        } else {
            checkBooleanFields('cacheable', data, false, true);
            checkBooleanFields('useplatformstyle', data, false, false);
        }
    } else {
        throw new TemplateParseException('contents info must be an object');
    }
}

function checkHandleField(data, name) {
    if (data[name] !== 'auto') {
        checkIntegerFields(['x', 'y'], data[name]);
    }
}

function checkConnectionHandles(data) {
    checkHandleField(data, 'sourcehandle');
    checkHandleField(data, 'targethandle');
}

function checkComponentInfo(data, componentType) {
    for (let [componentId, component] of Object.entries(data['components'][componentType])) {
        checkBooleanFields('collapsed', component, false);
    }
}


ConfigParser.prototype.validateJson = function () {
    checkStringFields(['title', 'description', 'longdescription', 'email', 'homepage', 'doc', 'changelog', 'image', 'smartphoneimage', 'license', 'licenseurl', 'issuetracker'], this.data);
    checkContactsFields(['authors', 'contributors'], this.data);
    // TODO ???checkStringFields(['type'], this.data, true)
    // Normalize/check preferences and properties (only for widgets and operators)
    if (this.data['type'] !== 'mashup') {
        checkArrayFields(['preferences', 'properties'], this.data);
        for (let preference of this.data['preferences']) {
            checkStringFields(['name', 'type'], preference, true);
            checkStringFields(['label', 'description', 'default'], reference);
            checkBooleanFields(['readonly', 'secure'],  preference);
            checkStringFields(['value'], preference, undefined, true);
            checkBooleanFields('required', preference);
        }

        for (let prop of this.data['properties']) {
            checkStringFields(['name', 'type'], prop, true);
            checkStringFields(['label', 'description', 'default'], prop);
            checkBooleanFields(['secure'], prop);
            checkBooleanFields(['multiuser'], prop);
        }
    }

    if (this.data['type'] === 'widget') {
        checkArrayFields(['altcontents'], this.data);
        if (this.data['contents'] === null || typeof this.data['contents'] !== 'object') {
            throw new TemplateParseException('Missing widget content info');
        }

        checkContentsField(this.data['contents'], false);
        if(this.data['altcontents'] !== undefined){
            for (let altcontent of this.data['altcontents']) {
                checkContentsField(altcontent);
            }
        }
    } else if (this.data['type'] === 'mashup') {
        checkArrayFields(['params', 'tabs', 'embedded'], this.data);

        for (let tab of this.data['tabs']) {
            checkStringFields(['name'], tab, true);
            checkStringFields(['title'], tab, false);
            checkArrayFields(['resources'], tab);
            for (let widget of tab['resources']) {
                let rendering = widget['rendering'] || {};
                checkIntegerFields(['layout'], rendering, undefined, true);
                checkBooleanFields(['relwidth'], rendering);
                checkBooleanFields(['relheight'], rendering);

                let position = widget['position'] || {};
                checkStringFields(['anchor'], position);
                checkBooleanFields(['relx'], position);
                checkBooleanFields(['rely'], position);
            }
        }

        for (let preference of this.data['params']) {
            checkStringFields(['name', 'type'], preference, true);
            checkStringFields(['label', 'description', 'default'], preference);
            checkBooleanFields('readonly', preference);
            checkStringFields(['value'], preference, undefined, true);
            checkBooleanFields('required', preference);
        }

        for (let component of this.data['embedded']) {
            if (typeof component === 'object') {
                checkStringFields(['vendor', 'name', 'version', 'src'], component, true);
            } else {
                throw new TemplateParseException('embedded component info must be an object');
            }
        }

        // if (this.data['wiring']  === undefined) {
        //     this.data['wiring'] = get_wiring_skeleton();
        // }

        checkStringFields(['version'], this.data['wiring']);

        if (this.data['wiring']['version'] === '1.0') {
            // TODO: update to the new wiring format
            let inputs = this.data['wiring']['inputs'];
            let outputs = this.data['wiring']['outputs'];
            //this.data['wiring'] = parse_wiring_old_version(this.data['wiring']);
            this.data['wiring']['inputs'] = inputs;
            this.data['wiring']['outputs'] = outputs;
            // END TODO
        } else if (this.data['wiring']['version'] === '2.0') {
            if (!('visualdescription' in this.data['wiring'])) {
                this.data['wiring']['visualdescription'] = {};
            }

            checkArrayFields('behaviours', this.data['wiring']['visualdescription'], false);
            checkBehaviourViewFields(this.data['wiring']['visualdescription']);
            for (let behaviour of this.data['wiring']['visualdescription']['behaviours']) {
                checkBehaviourViewFields(behaviour);
            }
        }

        // if (this.data['wiring']  === undefined) {
        //     this.data['wiring'] = {};
        // }

        checkArrayFields(['inputs', 'outputs'], this.data['wiring'], false);

        // Translations
        checkStringFields(['default_lang'], this.data);

        // Requirements
        checkArrayFields(['requirements'], this.data);
    }
}

class TemplateParseException extends Error {
    constructor(message) {
        super(message);
        this.name = "TemplateParseException";
    }
}
ConfigParser.prototype.getData = function (configFile) {
    return {
        name: this.data.root()._attr('name').value(),
        vendor: this.data.root()._attr('vendor').value(),
        version: this.data.root()._attr('version').value(),
        type: this.data.root().name()
    };
};

module.exports = ConfigParser;
