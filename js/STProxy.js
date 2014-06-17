var http = require("http");
var httpObject = require("./httpObject");
var router = require("./router");
var headers = require("./headers");

function start() {
  
    function onRequest(
        request,
        response
    )
    {
        var requestObject = {};
        var routeObject = {};
        var httpBody = "";
        var responseHeaders = "";

        request.on("data", function (data)
            {
                httpBody += data;
            });

        
        request.on("end", function() {
    
            requestObject = httpObject.parse(request);
            routeObject = router.route(requestObject);
            responseHeaders = headers.make(requestObject, routeObject);
 
            switch (requestObject["headers"]["stcproxy"]) {
                
                case "mirror":
                case "trace request":
                    
                    response.write('httpObject:\n');
                    response.write(JSON.stringify(requestObject));
                    response.write('\n');
                    
                    if (httpBody) {
                        response.write('httpBody:\n');
                        response.write(httpBody);
                        response.write('\n');
                    }
                                      
                    break;
                
                case "trace route":
                    
                    if (routeObject) {
                        response.writeHead(200, {"Content-Type": "text/json"});
                        response.write(JSON.stringify(routeObject));
                    } else {
                        response.writeHead(404, {"Content-Type": "text/plain"});
                        response.write("No route found");
                    }
                    
                    break;
                
                case "trace headers":
                    
                    if (routeObject) {
                        response.writeHead(200, {"Content-Type": "text/json"});
                        response.write(JSON.stringify(responseHeaders));
                    } else {
                        response.writeHead(404, {"Content-Type": "text/plain"});
                        response.write("No route found");
                    }
                    
                    
                    
                    break;
                
                default:
                    
                    response.write("Not implemented");
                                 
            }
            
            response.end();
        });
    };

    http.createServer(onRequest).listen(8888);
};

exports.start = start;