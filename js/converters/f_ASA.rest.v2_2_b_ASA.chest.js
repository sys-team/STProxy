var xmlBuilder  = require('xmlbuilder');
var emoji = require('../emoji');

function convert(
    jsonString,
    options
) {
    var result;
    var json;
    var xidRegexp = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;

    if (!jsonString) {
        return '';
    }

    json = JSON.parse(jsonString);

    result = xmlBuilder.create('post');

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

    for(var objArray in json['data']) {

        if (json['data'][objArray] instanceof Array) {

            json['data'][objArray].forEach(
            function(obj){
                var record = result.ele((options.isPatch ? 'm' : 'd'));

                record.att('name', objArray);

                if (obj['id']) {
                    record.att('xid', obj['id']);
                } else if (obj['xid']) {
                    record.att('xid', obj['xid']);
                }

                if (options.isPatch && options.idAsParameter) {
                    record.att(options.idAsParameter, options.entityId);
                }

                for (var prop in obj){
                    var attr;
                    var propValue;

                    //propValue = emoji.remove(obj[prop]);
                    propValue = emoji.escape(obj[prop]);

                    if (prop != 'xid' && prop != 'id') {
                        if (xidRegexp.test(propValue)) {
                            attr = record.ele('d');
                            attr.att('name', prop);
                            attr.att('xid', propValue);
                        } else {

                            attr = record.ele((isNaN(propValue) ? 'string' : 'double'), propValue);
                            attr.att('name', prop);
                        }
                    }
                }

            });
        }

    };

    return result.toString();
}

exports.convert = convert;
