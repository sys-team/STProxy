function makeFrontend(
    route,
    frontendResponseObj,
    frontendRequestData
) {
    var result = 200;
    var parsed = {};
    var notFoundRegexp = /^Entity .* not found$/;
    var deniedRegexp = /^Permission denied on entity.*$/;

    if (route['output-format'] == 'json') {
        
        parsed = JSON.parse(frontendResponseObj['data'])
        
        if (parsed['error'] == 'Not authenticated'
         || parsed['error'] == 'NotAuthorized'
         || parsed['error'] == 'Not authorized') {
            result = 401;
        } else if (deniedRegexp.test(parsed['error'])) {
            result = 403;
        } else if (notFoundRegexp.test(parsed['error'])) {
            result = 404;
        } else if (parsed['error']) {
            result = 500;
        } else if (frontendResponseObj['attributes']['page-row-count'] == '0'
                   && route['method'] == 'GET'
                   || frontendRequestData['method'] == 'DELETE') {
            result = 204;
        }
    } else {
        result = 200;        
    }
    
    return result;
}

exports.makeFrontend = makeFrontend;