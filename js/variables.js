function makeProxy(
    requestObject,
    routeObject
)
{
    var result = "";
    
    Object.keys(requestObject["variables"]).forEach(function(key) {
        result += (result == "" ? "" : "&") + key + "=" + requestObject["variables"][key];
    });
    
    return result;
}

exports.makeProxy = makeProxy;