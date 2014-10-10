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
    var json;
    var v3;
    
    if (route['output-format'] == 'xml') {
        return true;
    }
    
    try {
        var json = JSON.parse(frontendRequestBody);
    } catch (err) {
        return false;
    }
    
    switch (route.frontendLanguage) {
        
        case 'ASA.rest':
            
            if (Object.prototype.toString.call(json.data) != '[object Array]') {
                return false;
            }
            
            break;
            
        case 'ASA.rest.v2':
            
            if (route['response']) {
                if (route['response']['titles']) {
                    v3 = false;
                } else {
                    v3 = true;
                }
            }
            
            if (!v3) {
                
                if (typeof json.data != 'object'
                || Object.prototype.toString.call(json.data) == '[object Array]') {
                    return false;
                }
                
            } else {
                
                if (Object.prototype.toString.call(json) != '[object Array]') {
                    return false;
                }
                
            }

            break;
    }

    return true;
}

exports.backendResponse = backendResponse;
exports.frontendResponse = frontendResponse;
exports.frontendRequest = frontendRequest;