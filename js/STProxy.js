var http = require("http");
var httpObject = require("./httpObject");
var router = require("./router");
var headers = require("./headers");
var variables = require("./variables");
var body = require("./body");
var proxyRequest = require("./request");

function start() {
  
    function onRequest(
        request,
        response
    )
    {
        var requestObject = {};
        var routeObject = {};
        var requestBody = "";
        var proxyHeaders = {};
        var proxyVariables = "";
        var proxyBody = "";
        var proxyResponse = "";

        request.on("data", function (data)
            {
                requestBody += data;
            });

        
        request.on("end", function() {
    
            requestObject = httpObject.parse(request);
            routeObject = router.route(requestObject);
            
            if (!routeObject ) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("No route found");
                response.end();
                return;
            }
                    
            
            proxyHeaders = headers.makeProxy(requestObject, routeObject);
            proxyVariables = variables.makeProxy(requestObject, routeObject);
            proxyBody = body.makeProxy(requestObject, routeObject, requestBody);
 
            switch (requestObject["headers"]["stcproxy"]) {
                
                case "mirror":
                case "trace request":
                    
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write('httpObject:\n');
                    response.write(JSON.stringify(requestObject));
                    response.write('\n');
                    
                    if (requestBody) {
                        response.write('httpBody:\n');
                        response.write(requestBody);
                        response.write('\n');
                    }
                                      
                    break;
                
                case "trace route":

                    response.writeHead(200, {"Content-Type": "text/json"});
                    response.write(JSON.stringify(routeObject));
                    
                    break;
                
                case "trace headers":
                    
                    response.writeHead(200, {"Content-Type": "text/json"});
                    response.write(JSON.stringify(proxyHeaders));
                    
                case "trace variables":
                    
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write(proxyVariables);                   
                    
                    break;
                
                case "trace body":
                    
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write(proxyBody);                        
                    
                    break;
                
                default:
                    
                    proxyResponse =  proxyRequest.proxyRequest(
                                        requestObject,
                                        routeObject,
                                        proxyHeaders,
                                        proxyVariables,
                                        proxyBody);
                   
                    if (proxyResponse) {
                        response.write(proxyResponse.asString);
                    }
                    
                                 
            }
            response.write('\n');
            response.end();
        });
    };

    http.createServer(onRequest).listen(8888);
};

exports.start = start;