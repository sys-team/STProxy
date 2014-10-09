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

function frontendRequest(
    route,
    frontendRequestBody
) {
    /*
    var json;
    
    if (route.output-format == 'xml') {
        return true;
    }
    
    json = JSON.parse(frontendRequestBody);
    
    
    switch (route.frontendLanguage) {
        
        case 'ASA.rest':
            
            
            
            break;
            
        case 'ASA.rest.v2':
            
            if (route['response']) {
            if (route['response']['titles']) {
                options['titles'] = route['response']['titles'];
            }
            
            break;
    }
            
    */   
    
    return true;
}

exports.backendResponse = backendResponse;
exports.frontendResponse = frontendResponse;
exports.frontendRequest = frontendRequest;