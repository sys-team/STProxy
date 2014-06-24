function backendResponse(
    route,
    backendResponseBody
)
{
    
    if (route["output-format"] == "json") {
        try {
            parsed = JSON.parse(frontendResponseBody  );
        } catch (err) {
            //console.log(err);
           return false;
        }
 
    }

    return true;
}

exports.backendResponse = backendResponse;