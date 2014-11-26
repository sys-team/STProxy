function makeBackend(
    frontendRequestData,
    route
)
{
    var result = {};
    
    Object.keys(frontendRequestData.variables).forEach(function(key) {
        result[key.toLowerCase()] = frontendRequestData.variables[key];
    });
    
    using = route.using;
    
    if (using) {
        urlPartLength = frontendRequestData["url-parts"].length;
        
        if (using.entityAsParameter) {
           result[using.entityAsParameter] =  frontendRequestData["url-parts"][urlPartLength -2];
        }
        if (using.idAsParameter) {
           result[using.idAsParameter] =  frontendRequestData["url-parts"][urlPartLength -1];
        }
    }

    return result;
}

exports.makeBackend = makeBackend;