function parse(
    request
)
{
    var result = {};
    
    result["method"] = request.method;
    result["headers"] = request.headers;
    
    parsedUrl = require("url").parse(request.url, true);
    
    result["variables"] = parsedUrl.query;
    result["url"] = parsedUrl.pathname;
    result["url-parts"] = parsedUrl.pathname.substring(1).split('/');
    
    return result;
}

function body(
    request
)
{
    var body = '';
    
    request.on('data', function (data)
                        {
                            body += data;
                        });
    
    request.on('end', function()
                        {
                            //console.log(body);
                
                        });

    return body;
}

exports.parse = parse;
exports.body = body;