var xml2js  = require('xml2js');

function convert(
    xml,
    options
) {
    var i = 0;
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
        result[key] = json['response']['$'][key]; 
    });
    
    //console.log(json['response']['error']);
    
    if (json['response']['error']) {
        
        if (json['response']['error'][0]['$']) {
            result['error'] = json['response']['error'][0]['$']['code'];
        } else {
            result['error'] = json['response']['error'][0];
        }
    }
    
    result['data'] = [];
    
    if (json['response']['d']) {
        
        json['response']['d'].forEach(
            function(obj){
                var row = {};
                var types = [];
                var j = 0;
                
                //console.log(obj);
                
                row['name'] = obj['$']['name'];
                row['xid'] = obj['$']['xid'];
                row['result'] = obj['_'];
                
                if (typeof obj['_'] != 'string') {
                    
                    row['properties'] = {};
    
                    for (var prop in obj) {
                        if (prop != '$'  && types.indexOf(prop == -1)) {
                            types[j++] = prop;
                        }
                    }

                    types.forEach(
                        function(name){
                            obj[name].forEach(
                                function(prop){
                                    //console.log(prop);
                                    
                                    if (prop['$']['parent']) {
                                        row[prop['$']['name']] = {};
                                        row[prop['$']['name']]['name'] = prop['$']['parent'];
                                        row[prop['$']['name']]['xid'] = prop['$']['parent-xid'];
                                        row[prop['$']['name']]['id'] = prop['_'];
                                    } else {
                                        row['properties'][prop['$']['name']] = prop['_'];
                                    }
                                }
                            )
                        }
                    );
                    
                }
                
                result['data'][i++] = row;   
            });
        
    }   
    //console.log(result);
    
    resultObj['data']  = JSON.stringify(result);
    resultObj['attributes']  = attr; 

    return resultObj;   
}


exports.convert = convert;