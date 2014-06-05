var http = require("http");
var url = require("url");
var irequest = require("./request");

function getService(
    path
) {
    var service = {};
    var pathParts = [];
    
    pathParts = path.split('/');
    
    //console.log("pathParts = " + pathParts);
    
    if (pathParts[1] == "asa0.unact.ru") {
        
        service["type"] = "rest";
        service["url"] = "https://asa0.unact.ru/arest";
        service["pathParts"] = pathParts;
        
        return service;
    }
    
    return undefined;
}

function start() {
  
    function onRequest(
        request,
        response
    ) {
        var service = {};

        service = getService(url.parse(request.url).pathname);
        
        //.log("Service is " + serconsolevice);
        if (service) {
            irequest.asaRestRequest(service, request, response);
        } else {
            
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not found");
            response.end();
            
        }
        
    }

    http.createServer(onRequest).listen(8888);
}

exports.start = start;