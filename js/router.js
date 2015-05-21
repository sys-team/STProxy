function route(
    frontendRequestData,
    frontendRequestBody,
    configObject
) {

    var result = {};
    var frontend = '';
    var backend = '';
    var routingMethod ='';

    result.response = {};
    result.response.headers = {};

    // globals
    var globalResponseHeaders = configObject.response
        && configObject.response.headers;

    if (globalResponseHeaders) {
        Object.keys(globalResponseHeaders).forEach(function(key) {
            result.response.headers[key] = globalResponseHeaders[key];
        });
    }

    Object.keys(configObject.frontend).forEach(function(key) {

            if (frontendRequestData.url.indexOf(configObject.frontend[key].url) == 0) {

                frontend = key;
                result.frontend = key;
                result.frontendUrl = configObject.frontend[key].url;
                result.frontendLanguage = configObject.frontend[key].language;
                result['output-encoding'] = configObject.frontend[key].charset;

                if (result.frontendUrl[result.frontendUrl.length -1] != '/') {
                    result.frontendUrl = result.frontendUrl +'/';
                }

                if (configObject.frontend[key].response) {

                    if (configObject.frontend[key].response.headers) {
                        Object.keys(configObject.frontend[key].response.headers).forEach(function(hkey){
                            result.response.headers[hkey] = configObject.frontend[key].response.headers[hkey];
                        });
                    }

                    if (configObject.frontend[key].response.metadata) {
                         result.response.metadata = configObject.frontend[key].response.metadata;
                    }

                    if (configObject.frontend[key].response.titles) {
                         result.response.titles = configObject.frontend[key].response.titles;
                    }
                }

                var arrAttr = frontendRequestData.url.replace(configObject.frontend[key].url,'').substring(1).split('/').reverse();

                if (arrAttr.length > 1) {
                    result.entityId = arrAttr[0];
                    result.entityName = arrAttr[1];
                } else if (arrAttr.length == 1) {
                    result.entityName = arrAttr[0];
                }

                return false;
            }
            return true;
        });


    //console.log(frontend);

    if (frontendRequestData.method == 'POST'
     || frontendRequestData.method == 'PATCH') {

        routingMethod = 'POST';

    } else if (frontendRequestData['method'] == 'GET'
              || frontendRequestData['method'] == 'HEAD') {

        routingMethod = 'GET';

    } else {

        routingMethod = frontendRequestData.method;

    }
    var routing = configObject.routing;

    if (routing) {

        Object.keys(routing).forEach(function(key) {

            if (new RegExp(routing[key].from, 'i').test(frontend)
            && routing[key].method == routingMethod){

                backend = routing[key].to;

                if (routing[key].response) {
                    if (routing[key].response.headers) {
                        Object.keys(routing[key].response.headers).forEach(function(hkey){
                            result.response.headers[hkey] = routing[key].response.headers[hkey];
                        });
                    }

                    if (routing[key].response.status) {
                        result.response.status = routing[key].response.status;
                    }

                    if (routing[key].response.metadata) {
                        result.response.metadata = routing[key].response.metadata;
                    }
                }

                if (routing[key].using) {
                    result.using = {};

                    Object.keys(routing[key].using).forEach(function(ukey){
                            result.using[ukey] = routing[key].using[ukey];
                    });
                }

                return false;
            }
            return true;
        });

    }

    //console.log(backend);

    Object.keys(configObject.backend).forEach(function(key) {

            if (key == backend ) {

                result.backend = key;

                Object.keys(configObject.backend[key]).forEach(function(bkey){
                    result[bkey] = configObject.backend[key][bkey];
                });

                result.encoding = configObject.backend[key].charset;

                return false;
            }
            return true;
        });


    if (configObject.response && configObject.response.headers) {
        Object.keys(configObject.response.headers).forEach(function(key) {
            result.response.headers[key] = configObject.response.headers[key];
        });
    }

    result['output-format'] = outputFormat(
                                configObject,
                                frontend,
                                frontendRequestData.url,
                                frontendRequestData.headers);

    //console.log(result);

    if (!result.headersRe && configObject.service.headersRe){
        result.headersRe = configObject.service.headersRe;
    }

    if (result.language || result.frontend && result.response.status) {
        return result;
    } else {
        return undefined;
    }

}

function outputFormat(
    configObject,
    frontend,
    url,
    headers
) {

    var response = frontend
        && configObject.frontend[frontend]
        && configObject.frontend[frontend].response
    ;

    if (!response) {
        return 'json';
    }

    if (response.format == 'XML') {
        //console.log('response.format');
        return 'xml';
    }

    var formatRe = response.formatRe;

    if (formatRe) {

        if (formatRe.URL && new RegExp(formatRe.URL.XML, 'i').test(url)){
            //console.log('URL');
            return 'xml';
        }

        if (formatRe.headers && new RegExp(formatRe.headers.Accept, 'i').test(headers['accept']) ) {
            //console.log('headers');
            return 'xml';
        }
    }

    return 'json';
}


exports.route = route;
