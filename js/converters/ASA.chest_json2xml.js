var xmlBuilder  = require('../node_modules/xmlbuilder');

function convert(
    jsonString,
    options
)
{
    var result;
    var json;
    
    if (!jsonString) {
        return "";
    }

    json = JSON.parse(jsonString);
    
    result = xmlBuilder.create("post");
    
    json["data"].forEach(function(obj){
        var record = result.ele((options["isPatch"] ? "m" : "d"));
        
        record.att("name", obj["name"]);
        record.att("xid", obj["xid"]);
        
        for (var prop in obj["properties"]){
            var attr;
            if (prop != "parent") {
                attr = record.ele((isNaN(obj["properties"][prop]) ? "string" : "double"), obj["properties"][prop]);
                attr.att("name", prop);
            } else {
                attr = record.ele("d", obj["properties"][prop]["id"]);
                attr.att("name", obj["properties"][prop]["name"]);
                attr.att("xid", obj["properties"][prop]["xid"]);
            }
        };
   
    });

    return result.toString();
}

exports.convert = convert;