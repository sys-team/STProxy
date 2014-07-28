function makeBackend(
    route,
    frontendRequestData
)
{
    var result = {},
        transHeaders = ['Authorization',
                        'if-none-match',
                        'if-modified-since',
                        'Page-size'];
        
    result['user-agent'] = 'STProxy 0.1';
    
    transHeaders.forEach(function(value, ind, arr)
        {
            if (frontendRequestData['headers'][value.toLowerCase()]) {
                result[value] = frontendRequestData['headers'][value.toLowerCase()];
            }
        });
    
    Object.keys(frontendRequestData['headers']).forEach(function(key)
        {                                                
            if (key.toLowerCase().indexOf('backend-') == 0) {
                result[key.toLowerCase().replace('backend-', '')] = frontendRequestData['headers'][key.toLowerCase()];
            }
        });

    return result;
}

function makeFrontend(
    route,
    frontendRequestData,
    frontendResponseBody
)
{
    var result = {};
    var parsed = {};
    
    switch (route['output-format']){
        case 'xml':
            
            result['Content-Type']= 'text/xml';
            break;
        
        case 'json':
            
            result['Content-Type']= 'application/json';
            break;
        
        default:
            
            result['Content-Type']= 'text/plain';        
    }
    
    if (frontendRequestData['method'] == 'HEAD') {
        result['content-length'] = '0';
        result['connection'] = 'close';
    }
    
    parsed = JSON.parse(frontendResponseBody);
    
    Object.keys(parsed).forEach(function(key){
        if (key != 'data') {
            result[key.toLowerCase()] = parsed[key].toString();
        };
    });
    
    return result;
}

exports.makeBackend = makeBackend;
exports.makeFrontend = makeFrontend;