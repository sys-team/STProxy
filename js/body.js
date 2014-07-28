var translate = require('./translate');

function makeBackend(
    frontendRequestData,
    route,
    frontendRequestBody
)
{
    var result = '';
    
    switch (route['method']) {
        case 'GET':
            
            result = undefined;
            break;
        
        case 'POST':
            
            result = translate.frontendRequest(route, frontendRequestBody, frontendRequestData);
            break;
        
        default:
            result = undefined;
    }

    //console.log(result);
    return result;

}


exports.makeBackend = makeBackend;
