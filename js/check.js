function backendResponse(
    route,
    backendResponseBody
)
{
    
    //console.log(backendResponseBody);
    
    if (route["format"] == "json") {
        try {
            parsed = JSON.parse(backendResponseBody);
        } catch (err) {
           return false;
        }
 
    }

    return true;
}

exports.backendResponse = backendResponse;