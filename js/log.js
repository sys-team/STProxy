function request(
    requestData,
    route,
    status
){

    console.log('%s %s %s %s %s %s %s %s',
        new Date().toString(),
        requestData['client-ip'].toString(),
        (route ? route['frontend'] : 'Undefined'),
        requestData['method'],
        requestData['url'],
        (route ? route['backend'] : 'Undefined'),
        (route ? route['url'] : 'Undefined'),
        status
    )
}

exports.request = request;

