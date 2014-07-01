var fs = require("fs");
var extend = require("./node_modules/extend");

function readConfig(
    configDir,
    configName
)
{
    var result = {};
    var str = "";

    if (!configName) {
        configName = "*.stproxy.json";
    }
    
    if (!configDir) {
        configDir = "../config/";
    }
    
    files = fs.readdirSync(configDir);
    
    files.forEach(function(file){
        if (file.toLowerCase().indexOf("stproxy.json") != -1) {
            
            str = fs.readFileSync(configDir + file, "utf8");
            var parsed = JSON.parse(str);
            
            extend(true, result, parsed );
            
        }
    });
    
    //console.log(result);

    return JSON.stringify(result);   
    
}

exports.readConfig = readConfig;