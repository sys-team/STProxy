function makeProxy(
    requestObject,
    routeObject
)
{
    var result = {};
    var transHeaders = ["authorization","if-none-match"];
    
    result["user-agent"] = "STProxy 0.1";
    
    transHeaders.forEach(function(value, ind, arr)
        {
            if (requestObject["headers"][value]) {
                result[value] = requestObject["headers"][value];
            }
        });
    
    return result;
}

exports.makeProxy = makeProxy;