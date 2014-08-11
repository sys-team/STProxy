function backendResponse(
    route,
    backendResponseBody
) {
    
    //console.log(backendResponseBody);
    
    if (route['format'] == 'json') {
        try {
            parsed = JSON.parse(backendResponseBody);
        } catch (err) {
            return false;
        }
    }

    return true;
}

function frontendResponse(
    route,
    frontendResponseBody
) {
    
    if (route['output-format'] == 'json') {
        try {
            parsed = JSON.parse(frontendResponseBody);
        } catch (err) {
            //console.log(err);
            return false;
        }
    }

    return true;
}

exports.backendResponse = backendResponse;
exports.frontendResponse = frontendResponse;