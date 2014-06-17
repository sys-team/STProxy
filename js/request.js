var https = require("https");
var url = require("url");
var iconv  = require('./node_modules/iconv');

function asaRestRequest(
    service,
    request,
    response
)
{
    var options = {};
    var headers = {}
    var pathMethod;
    
    switch(request.method) {
        case "GET":
            pathMethod = "GET";
            break;
    }
    
    headers["authorization"] = request.headers["authorization"];
    
    options["hostname"] = url.parse(service["url"]).host;
    options["port"] = 443;
    options["path"] =  url.parse(service["url"]).pathname + '/' + pathMethod + '/' + service["pathParts"][2];
    options["method"] = "GET";
    options["rejectUnauthorized"] = false;
    options["headers"] = headers;
    
    //console.log("path = " + options["path"]);
    //console.log(request.headers);
    //console.log( request.headers["authorization"]);
    
    var req = https.request(options,
                            function(resp){
                                            var str = "";
                                            var conv = iconv.Iconv('windows-1251', 'utf8');
                                            
                                            resp.on('data', function(chunk) {
                                                str += conv.convert(chunk).toString();
                                            });
                                            
                                            resp.on('end', function() {
                                                var c = "./converters/asaRestXML2JSON";
                                                var converter = require(c);
                                                
                                                response.writeHead(200, {"Content-Type": "text/plain"});
                                                str = converter.convert(str);
                                                response.write(str);
                                                response.end();
                                                });
            
                                           });
    
    req.end();

    req.on('error', function(e) {console.error(e);});

}


exports.asaRestRequest = asaRestRequest;