var xmlBuilder  = require('xmlbuilder');
var emoji = require('../emoji');

function convert(
    jsonString,
    options
) {
    var result;
    var xmlRoot;
    var json;

    if (!jsonString) {
        return '';
    }

    json = JSON.parse(jsonString);


    if (!options['titles']) {

        if (!(json instanceof Array)) {
           var arr = [];
           arr[0] = json;
           json = arr;
        }

        var keepArray = json;
        json = {};
        json['data'] = [];
        json['data'][options.entityName] = keepArray;
    }


    xmlRoot = xmlBuilder.create('post');

    result = processJSON(xmlRoot, json, options, 0);

    return xmlRoot.toString();
}

function processJSON(
    xmlRoot,
    json,
    options,
    level
) {
    var result;
    var xidRegexp = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;

    for(var objArray in json['data']) {

        if (json['data'][objArray] instanceof Array) {

            json['data'][objArray].forEach(
            function(obj){
                var dataHeaders;
                var record = xmlRoot.ele((options.isPatch && level == 0 ? 'm' : 'd'));

                if (options.dataHeaders) {
                    dataHeaders = JSON.parse(JSON.stringify(options.dataHeaders));
                }

                if (level == 0) {
                    record.att('name', objArray);
                }

                if (obj['id']) {
                    record.att('xid', obj['id']);
                } else if (obj['xid']) {
                    record.att('xid', obj['xid']);
                }

                if (options.isPatch && options.idAsParameter) {
                    record.att(options.idAsParameter, options.entityId);
                }

                for (var prop in obj){
                    var propValue;
                    var propLowerName = prop.toLowerCase();

                    if (dataHeaders && dataHeaders[propLowerName]) {
                        propValue = dataHeaders[propLowerName];
                        dataHeaders[propLowerName] = null;
                    } else {
                        propValue = obj[prop];
                    }

                    propValue = emoji.escape(propValue);

                    if (prop != 'xid' && prop != 'id') {
                        if (xidRegexp.test(propValue)) {
                            attr = record.ele('d');
                            attr.att('name', prop);
                            attr.att('xid', propValue);
                        } else {

                            if (typeof propValue == 'object'
                                && Object.prototype.toString.call(propValue) == '[object Array]') {

                                var arrAtt;
                                var name = {};

                                name.name = prop;

                                arrAtt = record.ele(
                                    'array',
                                    name
                                )

                                propValue.forEach(function(aValue, i){

                                    if (typeof aValue == 'object') {
                                        var obj = {data:{}};

                                        obj.data[prop] = [];
                                        obj.data[prop].push(aValue);

                                        attr = processJSON(arrAtt, obj, options, level +1);
                                    } else {
                                        processValue(options, arrAtt, undefined, aValue, level);
                                    }
                                });

                            } else {
                                processValue(options, record, prop, propValue, level);
                            }

                        }
                    }
                }

                if (dataHeaders){
                    var hattr;

                    Object.keys(dataHeaders).forEach(function(key) {
                        if (dataHeaders[key]) {
                            hattr = record.ele('s', dataHeaders[key]);
                            hattr.att('name', key);
                        }
                    });
                }

            });
        }
    };

    return result;
}

function processValue(
    options,
    record,
    valueName,
    value,
    level
) {

    var attr;
    var name = {};

    if (valueName) {
        name.name = valueName;
    }

    if (typeof value == 'boolean'
        && options.jsonBoolean
        && options.jsonBoolean.name
        && options.jsonBoolean[true]
        && options.jsonBoolean[false]) {

        atrr = record.ele(
            options.jsonBoolean.name,
            name,
            (value ? options.jsonBoolean.true :options.jsonBoolean.false)
        );

    } else {
        attr = record.ele(
            (isNaN(value) ? 'string' : 'double'),
            name,
            value
        );
    }

}



exports.convert = convert;
