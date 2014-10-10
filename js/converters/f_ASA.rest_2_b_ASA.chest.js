var xmlBuilder  = require('xmlbuilder');

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
            
            var record = result.ele((options['isPatch'] ? 'm' : 'd'));
            
            if (obj['name']) {record.att('name', obj['name']);}
            if (obj['xid']) {record.att('xid', obj['xid']);}
            
            if (obj['properties']) {
            
                for (var prop in obj['properties']){
                    var attr;
                    if (typeof obj['properties'][prop] != 'object') {
                        attr = record.ele((isNaN(obj['properties'][prop]) ? 'string' : 'double'), obj['properties'][prop]);
                        attr.att('name', prop);
                    } else {
                        if (obj['properties'][prop]['id']) {
                            attr = record.ele('d', obj['properties'][prop]['id']);
                        } else {
                            attr = record.ele('d');
                        }
                        attr.att('name', prop);
                        if (obj['properties'][prop]['xid']) {attr.att('xid', obj['properties'][prop]['xid']);}
                    }
                };
            }
       
        });
    }
    
    return result.toString();
}

exports.convert = convert;