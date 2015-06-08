var xmlBuilder  = require('xmlbuilder');
var emoji = require('../emoji');

function convert(
    jsonString,
    options
) {
    var result;
    var json;

    if (!jsonString) {
        return '';
    }

    json = JSON.parse(jsonString);

    result = xmlBuilder.create('post');

    if (Object.prototype.toString.call( json['data'] ) === '[object Array]') {

        json['data'].forEach(function(obj){
            var dataHeaders = JSON.parse(JSON.stringify(options.dataHeaders));
            var record = result.ele((options['isPatch'] ? 'm' : 'd'));

            if (obj['name']) {record.att('name', obj['name']);}
            if (obj['xid']) {record.att('xid', obj['xid']);}

            if (obj.properties) {

                for (var prop in obj.properties){
                    var attr;
                    var propValue;
                    var propLowerName = prop.toLowerCase();

                    if (typeof obj.properties[prop] != 'object') {

                        if (dataHeaders && dataHeaders[propLowerName]) {
                            propValue = dataHeaders[propLowerName];
                            dataHeaders[propLowerName] = null;
                        } else {
                            propValue = obj.properties[prop];
                        }

                        attr = record.ele((isNaN(obj.properties[prop]) ? 'string' : 'double'), emoji.escape(propValue));
                        attr.att('name', prop);

                    } else {
                        if (obj.properties[prop]['id']) {
                            attr = record.ele('d', obj.properties[prop]['id']);
                        } else {
                            attr = record.ele('d');
                        }
                        attr.att('name', prop);
                        if (obj.properties[prop]['xid']) {attr.att('xid', obj.properties[prop]['xid']);}
                    }
                };
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

    return result.toString();
}

exports.convert = convert;
