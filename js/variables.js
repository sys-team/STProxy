function makeBackend(
    frontendRequestData,
    route
)
{
    var result = {};
    
    Object.keys(frontendRequestData['variables']).forEach(function(key) {
        result[key.toLowerCase()] = frontendRequestData['variables'][key];
    });
    
    return result;
}

exports.makeBackend = makeBackend;