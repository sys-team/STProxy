var fs = require("fs");
var deepmerge = require("./STDeepMerge");

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
            
            try {
                var parsed = JSON.parse(str);
            } catch (err) {
                console.log("config error");
                result = undefined;
                return false;
            }
            
            var r = deepmerge(result, parsed);
            result = r;
            
        }
    });
    
    //console.log(result);

    return JSON.stringify(result);   
    
}

exports.readConfig = readConfig;