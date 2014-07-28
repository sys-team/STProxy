var xml2js  = require('xml2js');

function convert(
    xml,
    options
)
{
    var json;
    var result = {};
    var str = '';
    var parser = new xml2js.Parser();
    
    parser.parseString(xml,
        function(err, res){
            json = res;           
        });
    
    Object.keys(json['response']['$']).forEach(function(key){
        result[key] = json['response']['$'][key];  
    });
    
    if (json['response']['error']) {
        
        if (options['isChest']) {
            result['error'] = json['response']['error'][0]['$']['code'];
        } else {
            result['error'] = json['response']['error'][0];
        }
    }
    
    result['data'] = {};
    
    if (json['response']['d']) {
        
        json['response']['d'].forEach(
            function(obj){
                var row = {};
                var types = [];

                //console.log(obj);
                
                if (!result['data'][obj['$']['name']]) {
                    result['data'][obj['$']['name']] = [];
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
                
                result['data'][obj['$']['name']].push(row);
                
            });

    }
    
    
    str = JSON.stringify(result); 

    return str;    
}


exports.convert = convert;