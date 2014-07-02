function makeFrontend(
    route,
    frontendResponseBody
)
{
    var result = 200;
    var parsed = {};
    
    parsed = JSON.parse(frontendResponseBody);

    if (route["output-format"] == "json") {
        if (parsed["error"] == "Not authenticated"
         || parsed["error"] == "NotAuthorized") {
            result = 401;
        } else if (parsed["page-row-count"] == "0" && route["method"] == "GET" ) {
            result = 204;
        }
    }
        
    return result;
}

exports.makeFrontend = makeFrontend;