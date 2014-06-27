function route(
    frontendRequestData,
    frontendRequestBody
)
{
    
    var result = {};

    switch (frontendRequestData["method"]) {
        case "POST":
            
            result["language"] = "ASA.chest";
            if (frontendRequestBody) {
                result["url"] = "https://asa0.unact.ru/chest/chest";
            } else {
                result["url"] = "https://asa0.unact.ru/chest/settings";
            }
            //result["url"] = "http://op.unact.ru/op/echo";
            result["format"] = "xml";
            result["encoding"] = "utf8";
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