function makeBackend(
    frontendRequestData,
    route
)
{
    var result = {},
        transHeaders = ["Authorization","if-none-match"];
    
    result["user-agent"] = "STProxy 0.1";
    
    transHeaders.forEach(function(value, ind, arr)
        {
            if (frontendRequestData["headers"][value.toLowerCase()]) {
                result[value] = frontendRequestData["headers"][value.toLowerCase()];
            }
        });

    return result;
}

function makeFrontend()
{
    var result = {};
    
    result ={"Content-Type": "text/plain"};
    
    return result;
}

exports.makeBackend = makeBackend;
exports.makeFrontend = makeFrontend;