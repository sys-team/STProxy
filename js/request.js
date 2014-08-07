var request  = require('request');

function backend(
    route,
    frontendRequestData,
    backendRequestHeaders,
    backendRequestVariables,
    backendRequestBody,
    callback
) {
    var options = {};
    
    options['strictSSL'] = false;
    options['encoding'] = 'binary';
    
    options['url'] =  route['url'] + (frontendRequestData['url'] != '/' ?
                      '/' + frontendRequestData['url'].replace(route['frontendUrl'], '') : '');
    

    options['method'] = route['method'];
    options['headers'] = backendRequestHeaders;
    options['qs'] = backendRequestVariables;
    
    if (backendRequestBody) {
        options['body'] = backendRequestBody.toString();
    }

    request(options, function(error, response, body)
        {
            callback(error, response, body);
        });
    
}

exports.backend = backend;