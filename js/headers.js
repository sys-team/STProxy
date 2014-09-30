var util = require('./util');

////////////
function makeBackend(
    route,
    frontendRequestData
) {
    var result = {},
        transHeaders = ['Authorization',
                        'if-none-match',
                        'if-modified-since',
                        'Page-size'];
        
    result['user-agent'] = 'STProxy 0.1';
    
    transHeaders.forEach(function(value, ind, arr) {
        if (frontendRequestData['headers'][value.toLowerCase()]) {
            result[value] = frontendRequestData['headers'][value.toLowerCase()];
        }
    });

    Object.keys(frontendRequestData['headers']).forEach(function(key) {                                                
        if (key.toLowerCase().indexOf('backend-') == 0) {
            result[key.toLowerCase().replace('backend-', '')] = frontendRequestData['headers'][key.toLowerCase()];
        }
    });
    
    return result;
}

function makeFrontend(
    route,
    frontendRequestData,
    attributes
) {
    var result = {};
        canResult = {};
    
    switch (route['output-format']){
        case 'xml':
            
            result['Content-Type']= 'text/xml; charset=' + route['output-encoding'];
            break;
        
        case 'json':
            
            result['Content-Type']= 'application/json; charset=' + route['output-encoding'];
            break;
        
        default:
            
            result['Content-Type']= 'text/plain';        
    }
    
    if (frontendRequestData['method'] == 'HEAD') {
        result['content-length'] = '0';
        result['connection'] = 'close';
    }
    
    Object.keys(attributes).forEach(function(key){
        if (key != 'data') {
            result[key.toLowerCase()] = attributes[key].toString();
        };
    });
    
    Object.keys(route['response']['headers']).forEach(function(key) {
        result[key.toLowerCase()] = route['response']['headers'][key];
    });
    
    Object.keys(result).forEach(function(key) {
        canResult[util.canonicalize(key)] = result[key];
    });

    return canResult;
}

exports.makeBackend = makeBackend;
exports.makeFrontend = makeFrontend;