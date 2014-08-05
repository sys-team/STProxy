var fs = require('fs');
var deepmerge = require('./STDeepMerge');

function readConfig(
    configDir,
    configName
) {
    var result = {};
    var str = '';

    if (!configName) {
        configName = '*.stproxy.json';
    }
    
    if (!configDir) {
        configDir = '../config/';
    }
    
    files = fs.readdirSync(configDir);
    
    files.forEach(function(file){
        if (file.toLowerCase().indexOf('stproxy.json') != -1) {
            
            str = fs.readFileSync(configDir + file, 'utf8');
            
            try {
                var parsed = JSON.parse(str);
            } catch (err) {
                console.log('config error');
                result = undefined;
                return false;
            }
            
            var r = deepmerge(result, parsed);
            result = r;
            
        }
    });
    
    //console.log(result);
    process.argv.forEach(function (val, index, array) {
        if (val == '--config'){
            if (array[index +1]) {
                //console.log(array[index +1].substr(0, array[index +1].indexOf('=')));
                //.log(array[index +1].substr(array[index +1].indexOf('=')));

            };
            
        }
    });

    return JSON.stringify(result);   
    
}

exports.readConfig = readConfig;