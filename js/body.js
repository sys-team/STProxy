var iconv  = require('./node_modules/iconv');

function makeProxy(
    requestObject,
    routeObject,
    httpBody
)
{
    var result = "";
    
    if (routeObject["method"] == "GET") {
        result = undefined;   
    }

   return result;

}

function translateResponse(
)
{
    var conv = iconv.Iconv('windows-1251', 'utf8');
    conv.convert(chunk).toString();
    
    var c = "./converters/asaRestXML2JSON";
    var converter = require(c);
 
    response.writeHead(200, {"Content-Type": "text/plain"});
    str = converter.convert(str);

    
}


exports.makeProxy = makeProxy;
exports.translateResponse = translateResponse;