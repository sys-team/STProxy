function route(
    frontendRequestData,
    frontendRequestBody,
    configObject
)
{
    
    var result = {};
    var frontend = '';
    var backend = '';
    var routingMethod ='';
    
    result['headers'] = {};
    
    Object.keys(configObject['frontend']).forEach(function(key) {
        
            if (frontendRequestData['url'].indexOf(configObject['frontend'][key]['url']) == 0) {
                
                frontend = key;
                result['frontend'] = key;
                result['frontendUrl'] = configObject['frontend'][key]['url'];
                result['frontendLanguage'] = configObject['frontend'][key]['language'];
                result['output-encoding'] = configObject['frontend'][key]['charset'];
                
                if (result['frontendUrl'][result['frontendUrl'].length -1] != '/') {
                    result['frontendUrl'] = result['frontendUrl'] +'/';
                }
                
                if (configObject['frontend'][key]['response']) {
                    if (configObject['frontend'][key]['response']['headers']) {
                        Object.keys(configObject['frontend'][key]['response']['headers']).forEach(function(hkey){
                            result['headers'][hkey] = configObject['frontend'][key]['response']['headers'][hkey];
                        });
                    }
                }
                
                return false;
            }
            return true;
        });
    
    
    //console.log(frontend);
    
    if (frontendRequestData['method'] == 'POST'
     || frontendRequestData['method'] == 'PUT'
     || frontendRequestData['method'] == 'PATCH') {
        
        routingMethod = 'POST';
    }
    
    if (frontendRequestData['method'] == 'GET'
     || frontendRequestData['method'] == 'HEAD') {
        
        routingMethod = 'GET';
    }
    
    Object.keys(configObject['routing']).forEach(function(key) {
        
            if (configObject['routing'][key]['from'] == frontend
             && configObject['routing'][key]['method'] == routingMethod){
                
                backend = configObject['routing'][key]['to'];
                
                if (configObject['routing'][key]['response']) {
                    if (configObject['routing'][key]['response']['headers']) {
                        Object.keys(configObject['routing'][key]['response']['headers']).forEach(function(hkey){
                            result['headers'][hkey] = configObject['routing'][key]['response']['headers'][hkey];
                        });
                    }
                }
                
                return false;
            }
            return true;
        });
    
    //console.log(backend);
        
    Object.keys(configObject['backend']).forEach(function(key) {
            
            if (key == backend ) {
                
                result['backend'] = key;
                
                result['language'] = configObject['backend'][key]['language'];
                result['format'] = configObject['backend'][key]['format'];
                result['url'] = configObject['backend'][key]['url'];
                result['encoding'] = configObject['backend'][key]['charset'];
                result['method'] = configObject['backend'][key]['method'];
                
                return false;
            }
            return true;
        });
    
    result['output-format'] = 'json';
    
    if (result['language']) {
        return result;
    } else {
        return undefined;
    }
    
}


exports.route = route;