var fs = require("fs");
var iconv  = require('./node_modules/iconv');

////////////
function backendResponse(
    route,
    backendResponseBody
)
{
    var result = "";
    var cName = "";
    
    result = backendResponseBody;

    if (route["encoding"] != route["output-encoding"]) {
        
        var buff = new Buffer(result.toString(), "binary");
        var conv = iconv.Iconv(route["encoding"], route["output-encoding"]);
        
        result = conv.convert(buff).toString();
    }
    
    if (route["format"] != route["output-format"]) {
        cName = converterName(route, 0);
    
        if (!fs.existsSync(cName)) {
            result = 'No converter ' + cName + ' found';
        } else {
            var converter = require(cName);
            result = converter.convert(result);
            
        }
    }

    return result;    
}

////////////
function frontendRequest(
    route,
    frontendRequestBody
)
{
    var result = "";
    var cName = "";
    
    result = frontendRequestBody;
    
    if (route["format"] != route["output-format"]) {
        cName = converterName(route, 1);
    
        if (!fs.existsSync(cName)) {
            result = 'No converter ' + cName + ' found';
        } else {
            var converter = require(cName);
            result = converter.convert(result);
            
        }
    }
    
    if (route["output-encoding"] != route["encoding"]) {
        
        var buff = new Buffer(result.toString(), "binary");
        var conv = iconv.Iconv(route["output-encoding"], route["encoding"]);
        
        result = conv.convert(buff).toString();
    }
    
    return result;    
}

////////////
function converterName(
    route,
    direction
)
{
    if (direction == 0) {
        return  "./converters/"
                + route["language"] + "_" + route["format"] + "2" + route["output-format"]
                + ".js";
    } else {
        return  "./converters/"
                + route["language"] + "_" + route["output-format"] + "2" + route["format"]
                + ".js";        
    }
}

////////////
exports.backendResponse = backendResponse;
exports.frontendRequest = frontendRequest;