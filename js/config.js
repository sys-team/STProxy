var fs = require("fs");

function readConfig(
    configName
)
{

    if (!configName) {
        configName = "./STProxy.cfg.json";
    }
    
    result =  fs.readFileSync(configName, "utf8");
   
    return result;   
    
}

exports.readConfig = readConfig;