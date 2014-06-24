function makeFrontend(
    route,
    frontendResponseBody
)
{
    var result = 200;
    var parsed = {};

    if (route["output-format"] == "json") {
        if (parsed["error"] == "Not authenticated") {
            result = 401;
        }
    }
        
    return result;
}

exports.makeFrontend = makeFrontend;