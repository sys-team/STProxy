var request  = require('request');

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
    
    options.strictSSL = false;
    options.encoding = 'binary';
    
    if (route.method != 'POST') {
        options.url =  route.url + (frontendRequestData.url != '/' ?
                          '/' + preprocessUrl(frontendRequestData.url).replace(route.frontendUrl, '') : '');
    } else {
        options.url =  route.url 
    }
    
    using = route.using;
    
    if (using) {
        options.url = options.url.replace(
            frontendRequestData["url-parts"][frontendRequestData["url-parts"].length -2],
            (using.prefix ? using.prefix : '') +
            (using.name ? using.name : '') + 
            (using.suffix ? using.suffix : '')
            )
    }

    options.method = route.method;
    options.headers = backendRequestHeaders;
    options.qs = backendRequestVariables;
    
    if (backendRequestBody) {
        options.body = backendRequestBody.toString();
    }

    request(options, function(error, response, body)
        {
            callback(error, response, body);
        });
    
}

exports.backend = backend;