function backendResponse(
    route,
    backendResponseBody
)
{
    
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
)
{
    
    //console.log(backendResponseBody);
    
    if (route['output-format'] == 'json') {
        try {
            parsed = JSON.parse(frontendResponseBody);
        } catch (err) {
            return false;
        }
 
    }

    return true;
}

exports.backendResponse = backendResponse;
exports.frontendResponse = frontendResponse;