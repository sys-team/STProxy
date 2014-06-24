function makeBackend(
    frontendRequestData,
    route,
    frontendRequestBody
)
{
    var result = "";
    
    switch (route["method"]) {
        case "GET":
            
            result = undefined;
            break;
        
        case "POST":
            
            result = frontendRequestBody;
            break;
        
        default:
            result = undefined;
    }

    //console.log(result);
    return result;

}




exports.makeBackend = makeBackend;
