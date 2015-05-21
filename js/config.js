var fs = require('fs');
var deepmerge = require('./STDeepMerge');
var log = require('./log');

function readConfig(
    configDir,
    configNameRe
) {
    var result = {};
    var str = '';

    if (!configNameRe) {
        configNameRe = /^.*\.stproxy\.json$/i;
    }

    if (!configDir) {
        configDir = '../config/';
    }

    files = fs.readdirSync(configDir);

    files.forEach(function(file){
        if (configNameRe.test(file)) {

            str = fs.readFileSync(configDir + file, 'utf8');
            log.writeString('Config: ' + configDir + file);

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
                if (array[index +1].indexOf('service.port=') == 0){
                    result['service']['port'] = array[index +1].replace('service.port=', '');
                }
            };

        }
    });

    if (result['frontend']) {
        Object.keys(result['frontend']).forEach(function(key){
            log.writeString('Frontend: ' + key + ' ' + result['frontend'][key]['url'] + ' ' +result['frontend'][key]['language']);
        });
    }

    return JSON.stringify(result);

}

exports.readConfig = readConfig;
