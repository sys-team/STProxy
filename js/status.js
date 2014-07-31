function makeFrontend(
    route,
    frontendResponseObj
) {
    var result = 200;
    var parsed = {};
    var notFoundRegexp = /^Entity .* not found$/;
    
    //console.log(frontendResponseBody);
    parsed = JSON.parse(frontendResponseObj['data'])

    if (route['output-format'] == 'json') {
        if (parsed['error'] == 'Not authenticated'
         || parsed['error'] == 'NotAuthorized'
         || parsed['error'] == 'Not authorized') {
            result = 401;
        } else if (notFoundRegexp.test(parsed['error'])) {
            result = 404;
        } else if (parsed['error']) {
            result = 500;
        } else if (frontendResponseObj['attributes']['page-row-count'] == '0' && route['method'] == 'GET' ) {
            result = 204;
        }
    }
        
    return result;
}

exports.makeFrontend = makeFrontend;