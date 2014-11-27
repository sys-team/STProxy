var http = require('http');
var config = require('./config');
var httpObject = require('./httpObject');
var router = require('./router');
var status = require('./status');
var headers = require('./headers');
var variables = require('./variables');
var body = require('./body');
var irequest = require('./request');
var translate = require('./translate');
var check = require('./check');
var log = require('./log');

function start() {
  
    function onRequest(
        request,
        response
    )
    {
        var route= {};
        
        var frontendRequestData = {},
            frontendRequestBody = '';
            
        var frontendResponseStatus = 200,
            frontendResponseHeaders = {},
            frontendResponseBody = '';
            
        var backendRequestHeaders = {},
            backendRequestVariables = {},
            backendRequestBody = '';

        request.on('data', function (chunk)
            {
                frontendRequestBody += chunk;
            });

        
        request.on('end', function() {
    
            frontendRequestData = httpObject.parse(request);
            
            if (frontendRequestBody && configObject.service.log && configObject.service.log.body) {
                console.log(frontendRequestBody);
            }
                        
            route = router.route(
                frontendRequestData,
                frontendRequestBody,
                configObject
            );
            
            if (!route) {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write('No route found');
                response.end();
                log.writeAboutRequest(frontendRequestData, route, 404);
                return;
            }

            backendRequestHeaders = headers.makeBackend(route, frontendRequestData);
            backendRequestVariables = variables.makeBackend(frontendRequestData, route);
            backendRequestBody = body.makeBackend(frontendRequestData, route, frontendRequestBody);

            switch (frontendRequestData['headers']['stcproxy']) {
                
                case 'mirror':
                case 'trace request':

                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write('httpObject:\n');
                    response.write(JSON.stringify(frontendRequestData));
                    response.write('\n');
                    
                    if (frontendRequestBody) {
                        response.write('httpBody:\n');
                        response.write(frontendRequestBody);
                        response.write('\n');
                    }
                    
                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                                      
                    break;
                
                case 'trace route':

                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify(route));
                    
                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                    
                    break;
                
                case 'trace headers':
                    
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify(backendRequestHeaders));
                    
                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                    
                    break;                    
                    
                case 'trace variables':
                    
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify(backendRequestVariables));

                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                    
                    break;
                
                case 'trace body':
                    
                    response.writeHead(200, {'Content-Type': 'text/plain'});
                    response.write(backendRequestBody);
                    
                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                    
                    break;
            
                case 'trace config':
                    
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.write(JSON.stringify(configObject));
                
                    response.write('\n');
                    response.end();
                    
                    log.writeAboutRequest(frontendRequestData, route, 200);
                    
                    break;
                
                default:
                    
                    if (route['backend']) {
                        
                        if (route['method'] == 'POST' || route['method'] == 'PATCH') {
                            if (!check.frontendRequest(route, frontendRequestBody)) {
                                
                                response.writeHead(400, {'Content-Type': 'text/plain'});
                                response.write('Wrong POST format');
                                response.end();
                                
                                log.writeAboutRequest(frontendRequestData, route, 400);
                                
                                return;
                            }
                        }

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
                                    
                                    response.writeHead(500, {'Content-Type': 'text/plain'});
                                    response.write(backendResponseError.message);
                                    response.end();
                                    
                                    log.writeAboutRequest(frontendRequestData, route, 500);
                                    
                                    return;
                                
                                }
                                
                                if (!check.backendResponse(route, backendResponseBody)) {
                                    
                                    //console.log(backendResponseBody);
                                    response.writeHead(500, {'Content-Type': 'text/plain'});
                                    response.write('Invalid response from backend');
                                    response.end();
                                    
                                    log.writeAboutRequest(frontendRequestData, route, 500);
                                    
                                    return;
                                
                                }
                                
                                frontendResponseObj = translate.backendResponse(route, backendResponseBody);
                                
                                //console.log(frontendResponseObj);
                                
                                if (!check.frontendResponse(route, frontendResponseObj['data'])) {
                                    
                                    response.writeHead(500, {'Content-Type': 'text/plain'});
                                    response.write('Invalid response to frontend');
                                    response.end();
                                    
                                    log.writeAboutRequest(frontendRequestData, route, 500);
                                    
                                    return;
                                
                                }
                                
                                frontendResponseStatus = status.makeFrontend(route,
                                                                             frontendResponseObj,
                                                                             frontendRequestData);
                                frontendResponseHeaders = headers.makeFrontend(route,
                                                                               frontendRequestData,
                                                                               frontendResponseObj['attributes']);
                                response.writeHead(frontendResponseStatus, frontendResponseHeaders);
                                
                                if (frontendRequestData.method != 'HEAD'
                                 && frontendRequestData.method != 'DELETE') {

                                    if (frontendResponseObj.dataArray) {
                                        response.write(JSON.stringify(frontendResponseObj.dataArray));
                                    } else {
                                        response.write(frontendResponseObj.data.toString());
                                    }
                                }
                                
                                response.end();
                                
                                log.writeAboutRequest(frontendRequestData, route, frontendResponseStatus);
                            });
                    } else {

                        frontendResponseStatus = (route['response']['status'] ? route['response']['status'] : 200);
                        frontendResponseHeaders = (route['response']['headers'] ? route['response']['headers'] : 200);
                        
                        response.writeHead(frontendResponseStatus, frontendResponseHeaders);
                        response.end();
                        
                        log.writeAboutRequest(frontendRequestData, route, frontendResponseStatus);
                    }
                  
            }
        });
    };

    var domain = require('domain').create();
    var configObject = {};
    var service;

    domain.on('error', function(err){
        console.log(err);
    });
     
    domain.run(function(){
       
        log.writeString('STProxy start');
        configObject = JSON.parse(config.readConfig());
        
        if (!configObject) {
            console.log('Incorrect JSON in config file(s)');
            return;
        }
        
        service = configObject.service;
        
        if (service.ip instanceof Array) {
            
            service.ip.forEach(function(ip){
                http.createServer(onRequest).listen(service.port, ip);
            });
            
        } else {
            http.createServer(onRequest).listen(service.port);
        }

        log.writeString('Accepting requests on ' + configObject['service']['port'].toString());
    });

};

exports.start = start;
