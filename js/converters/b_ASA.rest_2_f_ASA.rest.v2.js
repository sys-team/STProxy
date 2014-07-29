var xml2js  = require('xml2js');

function convert(
    xml,
    options
) {
    var json;
    var result = {};
    var resultObj = {};
    var attr = {};
    var parser = new xml2js.Parser();
    
    parser.parseString(xml,
        function(err, res){
            json = res;           
        });
    
    Object.keys(json['response']['$']).forEach(function(key){
        attr[key] = json['response']['$'][key];  
    });
    
    if (json['response']['error']) {
        
        if (options['isChest']) {
            result['error'] = json['response']['error'][0]['$']['code'];
        } else {
            result['error'] = json['response']['error'][0];
        }
    }

    if (json['response']['d']) {
        
        json['response']['d'].forEach(
            function(obj){
                var row = {};
                var types = [];

                //console.log(obj);
                
                if (!result[obj['$']['name']]) {
                    result[obj['$']['name']] = [];
                }
                
                if (typeof obj['_'] != 'string') {
                
                    for (var prop in obj) {
                        if (prop != '$'  && types.indexOf(prop == -1)) {
                            types.push(prop);
                        }
                    }
                    
                    row['xid'] = obj['$']['xid'];
                
                    types.forEach(
                        function(name){
                            obj[name].forEach(
                                function(prop){
                                    //console.log(prop);
                                    if (prop['$']['parent']) {
                                        row[prop['$']['name']] = prop['$']['parent-xid'];;
                                    } else {
                                        row[prop['$']['name']] = prop['_'];
                                    }
                                }
                            )
                        }
                    );
                
                } else {
                    row[obj['$']['xid']] = obj['_'];

                    //console.log(obj);
                }
                
                result[obj['$']['name']].push(row);
                
            });

    }
    
    resultObj['data']  = JSON.stringify(result);
    resultObj['attributes']  = attr; 

    return resultObj;    
}


exports.convert = convert;