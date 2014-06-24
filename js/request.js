var request  = require("./node_modules/request");

function backend(
    route,
    frontendRequestData,
    backendRequestHeaders,
    backendRequestVariables,
    backendRequestBody,
    callback
)
{
    var options = {};
    
    options["strictSSL"] = false;
    options["encoding"] = "binary";
    
    options["url"] =  route["url"] + frontendRequestData["url"];
    options["method"] = route["method"];
    options["headers"] = backendRequestHeaders;
    options["qs"] = backendRequestVariables;
    
    if (backendRequestBody) {
        options["body"] == backendRequestBody;
    }

    request(options, function(error, response, body)
        {
            callback(error, response, body);
        });
    
}

exports.backend = backend;