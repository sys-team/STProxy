var fs = require("fs");
var iconv  = require('./node_modules/iconv');

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
        var conv = iconv.Iconv(route["encoding"], route["output-encoding"].toString());
        
        result = conv.convert(buff).toString();
    }
    
    cName = converterName(route);

    if (!fs.existsSync(cName)) {
        result = 'No converter ' + cName + ' found';
    } else {
        var converter = require(cName);
        result = converter.convert(result);
        
    }

    return result;    
}

function converterName(
    route
)
{
    return  "./converters/"
            + route["language"] + "_" + route["format"] + "2" + route["output-format"]
            + ".js";
    
}

exports.backendResponse = backendResponse;