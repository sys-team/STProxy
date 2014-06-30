var http = require("http");
var httpObject = require("./httpObject");
var router = require("./router");
var status = require("./status");
var headers = require("./headers");
var variables = require("./variables");
var body = require("./body");
var irequest = require("./request");
var translate = require("./translate");
var check = require("./check");

function start() {
  
    function onRequest(
        request,
        response
    )
    {
        var route= {};
        
        var frontendRequestData = {},
            frontendRequestBody = "";
            
        var frontendResponseStatus = 200,
            frontendResponseHeaders = {},
            frontendResponseBody = "";
            
        var backendRequestHeaders = {},
            backendRequestVariables = {},
            backendRequestBody = "";

        request.on("data", function (chunk)
            {
                frontendRequestBody += chunk;
            });

        
        request.on("end", function() {
    
            frontendRequestData = httpObject.parse(request);
            route = router.route(frontendRequestData, frontendRequestBody);
            
            if (!route) {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.write("No route found");
                response.end();
                return;
            }

            backendRequestHeaders = headers.makeBackend(frontendRequestData, route);
            backendRequestVariables = variables.makeBackend(frontendRequestData, route);
            backendRequestBody = body.makeBackend(frontendRequestData, route, frontendRequestBody);

            switch (frontendRequestData["headers"]["stcproxy"]) {
                
                case "mirror":
                case "trace request":

                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write("httpObject:\n");
                    response.write(JSON.stringify(frontendRequestData));
                    response.write("\n");
                    
                    if (frontendRequestBody) {
                        response.write("httpBody:\n");
                        response.write(frontendRequestBody);
                        response.write("\n");
                    }
                    
                    response.write("\n");
                    response.end();
                                      
                    break;
                
                case "trace route":

                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(route));
                    
                    response.write("\n");
                    response.end();
                    
                    break;
                
                case "trace headers":
                    
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(backendRequestHeaders));
                    
                    response.write("\n");
                    response.end();
                    
                case "trace variables":
                    
                    response.writeHead(200, {"Content-Type": "application/json"});
                    response.write(JSON.stringify(backendRequestVariables));

                    response.write("\n");
                    response.end();
                    
                    break;
                
                case "trace body":
                    
                    response.writeHead(200, {"Content-Type": "text/plain"});
                    response.write(backendRequestBody);
                    
                    response.write("\n");
                    response.end();
                    
                    break;
                
                default:
                    
                    irequest.backend(
                        route,
                        frontendRequestData,
                        backendRequestHeaders,
                        backendRequestVariables,
                        backendRequestBody,
                        function(
                            backendResponseError,
                            backendResponse,
                            backendResponseBody)
                        {
                            if (backendResponseError) {
                                
                                response.writeHead(500, {"Content-Type": "text/plain"});
                                response.write(backendResponseError.message);
                                response.end();
                                return;
                            
                            }
                            
                            if (!check.backendResponse(route, backendResponseBody)) {
                                
                                //console.log(backendResponseBody);
                                response.writeHead(500, {"Content-Type": "text/plain"});
                                response.write("Invalid response from backend");
                                response.end();
                                return;
                            
                            }
                            
                            frontendResponseBody = translate.backendResponse(route, backendResponseBody);
                            frontendResponseStatus = status.makeFrontend(route, frontendResponseBody);
                            frontendResponseHeaders = headers.makeFrontend(route, frontendResponseBody);
                            response.writeHead(frontendResponseStatus, frontendResponseHeaders);
                            response.write(frontendResponseBody.toString());
                            
                            response.end();
                        });
                  
            }
        });
    };

    http.createServer(onRequest).listen(8888);
};

exports.start = start;
