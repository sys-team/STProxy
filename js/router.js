function route(
    frontendRequestData
)
{
    
    var result = {};

    switch (frontendRequestData["method"]) {
        case "POST":
            
            result["language"] = "ASA.chest";
            result["url"] = "https://asa0.unact.ru/chest";
            result["format"] = "xml";
            result["encoding"] = "windows-1251";
            result["output-format"] = "json";
            result["output-encoding"] = "utf8";
            result["method"] = "POST";
            
            break;
        
        case "GET":

            result["language"] = "ASA.rest";
            result["url"] = "https://asa0.unact.ru/arest/get";
            result["format"] = "xml";
            result["encoding"] = "windows-1251";
            result["output-format"] = "json";
            result["output-encoding"] = "utf8";
            result["method"] = "GET";
            
            break;
        
        default:
            
            result = undefined;
            
    }
    
    return result;

}


exports.route = route;