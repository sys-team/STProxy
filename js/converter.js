var xml2js  = require('/usr/local/lib/node_modules/xml2js');

function asaRestXML2JSON(
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
            console.log(res);
            console.log('Done');
        });   
    
    result["ts"] = json["response"]["$"]["ts"];
    result["pageSize"] = json["response"]["$"]["page-size"];
    result["pageNumber"] = json["response"]["$"]["page-number"];
    result["pageRowCount"] = json["response"]["$"]["page-row-count"];
    
    result["data"] = [];
    
    json["response"]["d"].forEach(
        function(obj){
            var row = {};
            
            console.log(obj);
            
            row["name"] = obj["$"]["name"];
            row["xid"] = obj["$"]["xid"];
            
            
            result["data"][i++] = row;   
        });
    
    console.log(result);
    
    str = JSON.stringify(result); 

    return str;
    
}


exports.asaRestXML2JSON = asaRestXML2JSON;