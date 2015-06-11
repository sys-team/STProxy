var request  = require('request');

function preprocessUrl(
    url
) {
    if (url) {
        return url.replace('.xml', '');
    }
    return url;
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

        urlPartLength = frontendRequestData["url-parts"].length;

        processedName = '';

        if (using.name) {
            found = frontendRequestData["url-parts"][urlPartLength -2].match(new RegExp(using.name, 'i'));
            processedName = (found ? found[0] : '')
        } else {
            processedName = frontendRequestData["url-parts"][urlPartLength -2]
        }

        options.url = options.url.replace(
            frontendRequestData["url-parts"][urlPartLength -2],
            (using.prefix ? using.prefix : '') +
            processedName +
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
