var xml2js  = require('../node_modules/xml2js');

function convert(
    xml
)
{
    var i = 0;
    var json;
    var result = {};
    var str = "";
    var parser = new xml2js.Parser();
    
    parser.parseString(xml,
        function(err, res){
            json = res;
            //console.log(res);                 
        });   
    
    result["ts"] = json["response"]["$"]["ts"];
    result["pageSize"] = json["response"]["$"]["page-size"];
    result["pageNumber"] = json["response"]["$"]["page-number"];
    result["pageRowCount"] = json["response"]["$"]["page-row-count"];
    
    if (json["response"]["error"]) {
        result["error"] = json["response"]["error"][0];
    }
    
    result["data"] = [];
    
    if (json["response"]["d"]) {
        
        json["response"]["d"].forEach(
            function(obj){
                var row = {};
                var types = [];
                var j = 0;
                
                //console.log(obj);
                
                row["name"] = obj["$"]["name"];
                row["xid"] = obj["$"]["xid"];
                row["properties"] = {};
    
                for (var prop in obj) {
                    if (prop != "$"  && types.indexOf(prop == -1)) {
                        types[j++] = prop;
                    }
                }
                
                types.forEach(
                    function(name){
                        obj[name].forEach(
                            function(prop){
                                //console.log(prop);
                                
                                if (prop["$"]["parent"]) {
                                    row[prop["$"]["name"]] = {};
                                    row[prop["$"]["name"]]["name"] = prop["$"]["parent"];
                                    row[prop["$"]["name"]]["xid"] = prop["$"]["parent-xid"];
                                    row[prop["$"]["name"]]["id"] = prop["_"];
                                } else {
                                    row["properties"][prop["$"]["name"]] = prop["_"];
                                }
                            }
                        )
                    }
                );
                
                result["data"][i++] = row;   
            });
        
    }   
    //console.log(result);
    
    str = JSON.stringify(result); 

    return str;    
}


exports.convert = convert;