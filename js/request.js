var https = require("https");
var url = require("url");

function proxyRequest(
    requestObject,
    routeObject,
    headers,
    variables,
    body
)
{
    var result = "";
    var options = {};
    
    options["port"] = 443;
    options["rejectUnauthorized"] = false;
    
    options["hostname"] = url.parse(routeObject["url"]).host;
    options["path"] =  url.parse(routeObject["url"]).pathname
        + requestObject["url"]
        + (variables == "" ? "" : "?" + variables);
    
    options["method"] = routeObject["method"];
    options["headers"] = routeObject["headers"];
    
    console.log(options["hostname"]);
    console.log(options["path"]);

    
    var request = https.request(options, function(response)
        {
            response.on('data', function(chunk)
                {
                    result += chunk;
                });
            
            response.on('end', function()
                {
                    console.log(result);
                    request.end();
                    return result;
                });           
        });
    

    request.on('error', function(e) {console.error(e);});

}

exports.proxyRequest = proxyRequest;