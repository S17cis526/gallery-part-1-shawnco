'use strict';

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
 
var http = require('http');
var fs = require('fs');
var port = 3005;

var chess = fs.readFileSync('images/chess.jpg');
var fern = fs.readFileSync('images/fern.jpg');

function serveImage(filename, req, res)
{
	var body = fs.readFile('images/' + filename, function(err, body)
	{
		if (err)
		{
			console.log(err);
			res.statusCode = 500;
			res.statusMessage = 'I dun goofd';
			res.end('meh');
			return;
		}
		res.setHeader('Content-Type', 'image/jpeg');
		res.end();		
	});

}

var server = http.createServer((req, res) => 
{
	switch (req.url)
	{
		case '/chess':
  			//serveImage('chess.jpg', req, res);
  			res.end(chess);
			break;
		case '/fern':
		case '/fern/':
		case '/fern.jpg':
		case '/fern/jpeg':
			//serveImage('fern.jpg', req, res);
			res.end(fern);
			break;
		default:	
			res.statusCode = 404;
			res.statusMessage	= 'I am a teapot';
			res.end();
			break;
	};

});
server.listen(port, () =>
{
	console.log('Listening on port ' + port);
});