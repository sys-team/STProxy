function route(
    requestObject
)
{
    
    var result = {};

    switch (requestObject["method"]) {
        case "POST":
            
            result["language"] = "ASA.chest";
            result["url"] = 'https://asa0.unact.ru/chest';
            result["format"] = "xml";
            result["encoding"] = "utf8";
            result["output-format"] = "json";
            result["output-encoding"] = "windows-1251";
            result["method"] = "POST";
            
            break;
        
        case "GET":

            result["language"] = "ASA.rest";
            result["url"] = 'https://asa0.unact.ru/arest/get';
            result["format"] = "xml";
            result["encoding"] = "utf8";
            result["output-format"] = "json";
            result["output-encoding"] = "windows-1251";
            result["method"] = "GET";
            
            break;
        
        default:
            
            result = undefined;
            
    }
    
    return result;

}


exports.route = route;