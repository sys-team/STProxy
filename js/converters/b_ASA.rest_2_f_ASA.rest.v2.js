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
        if (options['metadata']) {
           result[key] = json['response']['$'][key];
        }
    });
    
    //console.log(json['response']['error']);
    if (json['response']['error']) {
        
        if (json['response']['error'][0]['$']) {
            result['error'] = json['response']['error'][0]['$']['code'];
        } else {
            result['error'] = json['response']['error'][0];
        }
    }

    if (json['response']['d']) {
        
        if (!options['titles']) {
            result['array'] = [];
        }
        
        json['response']['d'].forEach(
            function(obj){
                var row = {};
                var types = [];

                //console.log(obj);
                
                if (!result[obj['$']['name']]
                && options['titles']) {
                    result[obj['$']['name']] = [];
                }
                
                
                if (typeof obj['_'] != 'string') {
                
                    for (var prop in obj) {
                        if (prop != '$'  && types.indexOf(prop == -1)) {
                            types.push(prop);
                        }
                    }
                    
                    row['id'] = obj['$']['xid'];
                
                    types.forEach(
                        function(name){
                            obj[name].forEach(
                                function(prop){
                                    //console.log(prop);
                                    if (prop['$']['parent']) {
                                        row[prop['$']['name']] = prop['$']['parent-xid'];
                                    } else if(prop['$']['name'] != 'id') {
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
                
                if (options['titles']) {
                    result[obj['$']['name']].push(row);
                } else {
                    result['array'].push(row);
                }
                
            });

    }
    

    resultObj['data'] = JSON.stringify(result);
    if (!options['titles']){
        resultObj['dataArray'] = result['array'];
    }

    //console.log(resultObj)
    resultObj['attributes']  = attr; 

    return resultObj;    
}


exports.convert = convert;