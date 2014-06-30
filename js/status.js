function makeFrontend(
    route,
    frontendResponseBody
)
{
    var result = 200;
    var parsed = {};
    
    parsed = JSON.parse(frontendResponseBody);

    if (route["output-format"] == "json") {
        if (parsed["error"] == "Not authenticated") {
            result = 401;
        } else if (parsed["pageRowCount"] == "0" && route["method"] == "GET" ) {
            result = 204;
        }
    }
        
    return result;
}

exports.makeFrontend = makeFrontend;