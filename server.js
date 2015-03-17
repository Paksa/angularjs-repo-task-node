var http = require('http');
var path = require('path');
var fs = require('fs');
var url = require('url');
var port = 8080;

function onRequest(request, response) {
	var filepath = '.' + request.url;
	if (filepath === '.' || filepath === './') filepath = './index.html';
    var extname = path.extname(filepath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
		case '.js':
			contentType = 'text/javascript';
			break;
		case '.json':
			contentType = 'application/json';
			break;
    }
	fs.exists(filepath, function(exists) {
        if (exists) {
            fs.readFile(filepath, function(error, content) {
                if (error) {
					//500 - server internal error
                    response.writeHead(500);
                    response.end();
                }
                else {
					//200 - OK
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
	});
};
http.createServer(function(request, response) {
	console.log('Request METHOD: ' + request.method);
	var fullUrl = request.url;
	console.log('Request URL: ' + fullUrl);
	switch(request.method)
	{
		case 'GET':
			onRequest(request, response);
			break;
	}
}).listen(port);
console.log("Server has started at port " + port + ".");