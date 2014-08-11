function writeAboutRequest(
    requestData,
    route,
    status
) {

    console.log('%s %s %s %s %s %s %s %s',
        new Date().toISOString().replace('T', ' ').replace('Z', ''),
        (requestData.headers['x-real-ip'] || requestData['client-ip']).toString(),
        (route ? route['frontend'] : 'Undefined'),
        requestData['method'],
        requestData['url'],
        (route ? route['backend'] : 'Undefined'),
        (route ? route['url'] : 'Undefined'),
        status
    )
}

function writeString(
    data
) {
    console.log('%s %s',
        new Date().toISOString().replace('T', ' ').replace('Z', ''),
        data
    );
}

exports.writeAboutRequest = writeAboutRequest;
exports.writeString = writeString;
