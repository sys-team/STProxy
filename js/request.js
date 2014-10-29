var request = require('request');
var mail = require('mail');

function preprocessUrl(
    url
) {
    
    return url.replace('.xml', '');
}

function backend(
    route,
    frontendRequestData,
    backendRequestHeaders,
    backendRequestVariables,
    backendRequestBody,
    callback
) {

    var options = {};

    if (route.frontendLanguage == 'SMTP') {
        
        var messageOptions = {};
        
        options.host = route.host;
        options.username = route.username;
        options.password = route.password;
        options.secure = route.secure;
        options.port = route.port;
        options.domainName = route.domain;
        options.domain = route.domain;
        options.mimeTransport = route.mimeTransport;
        
        console.log(options);
        
        messageOptions.from = 'op@unact.ru';
        messageOptions.to = ['a.panshin@unact.ru'];
        messageOptions.subject= 'Test';
        
        mail.Mail(options)
            .message(messageOptions)
            .body('test test')
            .send(function(error) {
                    console.log(error);
                    callback(error);
                });
            
    } else {
        
        options.strictSSL = false;
        options.encoding = 'binary';
        
        if (route.method != 'POST') {
            options.url = route.url + (frontendRequestData.url != '/' ?
                          '/' + preprocessUrl(frontendRequestData.url).replace(route.frontendUrl, '') : '');
        } else {
            options.url =  route.url;
        }
    
        options.method = route.method;
        options.headers = backendRequestHeaders;
        options.qs = backendRequestVariables;
        
        if (backendRequestBody) {
            options.body = backendRequestBody.toString();
        }
        
        request(options, function(error, response, body) {
                callback(error, response, body);
            });
    }
}

exports.backend = backend;