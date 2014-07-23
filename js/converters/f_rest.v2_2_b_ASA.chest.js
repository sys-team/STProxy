var xmlBuilder  = require("xmlbuilder");

function convert(
    jsonString,
    options
)
{
    var result;
    var json;
    var xidRegexp = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;
    
    if (!jsonString) {
        return "";
    }

    json = JSON.parse(jsonString);
    
    result = xmlBuilder.create("post");

    for(var objArray in json["data"]) {
        
        if (Object.prototype.toString.call(json["data"][objArray]) === '[object Array]') {
            
            json["data"][objArray].forEach(
            function(obj){
                var record = result.ele((options["isPatch"] ? "m" : "d"));
            
                record.att("name", objArray);
                if (obj["xid"]) {record.att("xid", obj["xid"]);}
                
                for (var prop in obj){
                    var attr;
                        
                    if (prop != "xid") {
                        if (xidRegexp.test(obj[prop])) {
                            attr = record.ele("d");
                            attr.att("name", prop);
                            attr.att("xid", obj[prop]);
                        } else {
                            attr = record.ele((isNaN(obj[prop]) ? "string" : "double"), obj[prop]);
                            attr.att("name", prop);
                        }
                    }
                }
        
            });
        }
   
    };

    //console.log(result.toString());
    return result.toString();
}

exports.convert = convert;