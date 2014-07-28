var fs = require('fs');
var iconv = require('iconv');

////////////
function backendResponse(
    route,
    backendResponseBody
) {
    var result = '';
    var cName = '';
    var options = {};
    
    result = backendResponseBody;
    
    //console.log(backendResponseBody);


    if (route['encoding'] != route['output-encoding']) {
        
        var buff = new Buffer(result.toString(), 'binary');
        var conv = iconv.Iconv(route['encoding'], route['output-encoding']);
        
        result = conv.convert(buff).toString();
    } else {
        var buff = new Buffer(result.toString(), 'binary');
        result = buff.toString();
    }
    
    if (route['format'] != route['output-format']) {
        cName = converterName(route, 0);
    
        if (!fs.existsSync(cName)) {
            console.log('No converter ' + cName + ' found');
            return undefined;
        } else {
            try {
                var converter = require(cName);
                result = converter.convert(result, options);
            } catch(e) {
                console.log(e);
            }
        }
    }

    return result;    
}

////////////
function frontendRequest(
    route,
    frontendRequestBody,
    frontendRequestData
)
{
    var result = '';
    var cName = '';
    var options = {};
    
    result = frontendRequestBody;
    
    //console.log(route['output-encoding'],['encoding']);

    if (route['format'] != route['output-format']) {
        
        if (route['language'] == 'ASA.chest'
         && frontendRequestData['method'] == 'PATCH') {
            
            options['isPatch'] = true;
            
        }
        
        cName = converterName(route, 1);
    
        if (!fs.existsSync(cName)) {
            console.log('No converter ' + cName + ' found');
            return undefined;
        } else {
            try {
                var converter = require(cName);
                result = converter.convert(result, options);
            } catch(e) {
                console.log(e);
            }
            
        }
    }
    
    if (route['output-encoding'] != route['encoding']) {
        
        var buff = new Buffer(result.toString(), 'binary');
        var conv = iconv.Iconv(route['output-encoding'], route['encoding']);
        
        result = conv.convert(buff).toString();
    }
    
    

    return result;    
}

////////////
function converterName(
    route,
    direction
){
    
    if (direction == 0) {
        return './converters/' + 'b_' + route['language'] + '_2_f_' + route['frontendLanguage'] + '.js';
    } else {
        return './converters/' + 'f_' + route['frontendLanguage'] + '_2_b_' + route['language'] + '.js';
    }
    
}

////////////
exports.backendResponse = backendResponse;
exports.frontendRequest = frontendRequest;