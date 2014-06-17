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

exports.parse = parse;
