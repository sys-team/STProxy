function route(
    frontendRequestData,
    frontendRequestBody,
    configObject
)
{
    
    var result = {};
    var frontend = "";
    var backend = "";
    var routingMethod ="";
    
    Object.keys(configObject["frontend"]).forEach(function(key) {
            if (frontendRequestData["url"].indexOf(configObject["frontend"][key]["url"]) == 0) {
                
                frontend = key;
                return false;
            }
            return true;
        });
    
    
    if (frontendRequestData["method"] == "POST"
        || frontendRequestData["method"] == "PUT"
        || frontendRequestData["method"] == "PATCH") {
        
        routingMethod = "POST";
    }
    
    if (frontendRequestData["method"] == "GET") {
        
        routingMethod = "GET";
    }
    
    Object.keys(configObject["routing"]).forEach(function(key) {
        
            if (configObject["routing"][key]["from"] == frontend
               && configObject["routing"][key]["method"] == routingMethod){
                
                backend = configObject["routing"][key]["to"];
                return false;
            }
            return true;
        });
        
    Object.keys(configObject["backend"]).forEach(function(key) {
            
            if (key == backend ) {
                
                result["language"] = configObject["backend"][key]["language"];
                result["format"] = configObject["backend"][key]["format"];
                result["url"] = configObject["backend"][key]["url"];
                result["encoding"] = configObject["backend"][key]["charset"];
                result["method"] = configObject["backend"][key]["method"];
                
                return false;
            }
            return true;
        });
    
    result["output-format"] = "json";
    result["output-encoding"] = "utf8";
    
    
    return result;

}


exports.route = route;