var http = require("http");
var httpObject = require("./httpObject");

function start() {
  
    function onRequest(
        request,
        response
    )
    {
        requestObject = httpObject.parse(request);
        
        switch (requestObject["headers"]["stcproxy"]) {
            case "mirror":
                
                body = httpObject.body(request);
                
                response.write(JSON.stringify(requestObject));
                if (body) {
                    response.write(body);
                }
                
                response.end();
                break;
            
            case "trace":
                
                response.write("trace signaled");
                response.end()
                break;
            
            default:
                
                response.write("No Header");
                response.end();               
        }

    };

    http.createServer(onRequest).listen(8888);
};

exports.start = start;