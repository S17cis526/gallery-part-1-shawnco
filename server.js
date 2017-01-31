'use strict';

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var http = require('http');
var fs = require('fs');
var port = 3002;

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

var chess = fs.readFileSync('images/chess.jpg');
var fern = fs.readFileSync('images/fern.jpg');
var ace = fs.readFileSync('images/ace.jpg');
var stylesheet = fs.readFileSync('gallery.css');

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
		case '/gallery':
      var gHtml = imageNames.map(function(fileName)
      {
        return '<img src="' + fileName + '" />';
      }).join(' ');
			var html = '<!doctype html>';
			html += '<html><head><title>Dynamic Page</title>';
      html += '<link rel="stylesheet" href="general.css" type="text/css" />';
      html += '</head><body>';
			html += '<h1>Gallery</h1>';
//			html += '<img src="images/ace.jpg" alt="A fishing ace at work">';
      html += gHtml;
      html += '<h1>Hai</h1> Time is  ' + Date.now();
			html += '</body></html>';
			res.setHeader('Content-Type', 'text/html');
			res.end(html);
			break;
		case '/chess':
  			serveImage('chess.jpg', req, res);
  			res.end(chess);
			break;
		case '/fern':
		case '/fern/':
		case '/fern.jpg':
		case '/fern/jpeg':
			serveImage('fern.jpg', req, res);
			res.end(fern);
			break;
		case '/ace':
    case '/ace.jpg':
    case '/ace.jpeg':
			serveImage('ace.jpg', req, res);
      res.end(ace);
			break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
		default:
			res.statusCode = 404;
			res.statusMessage	= 'I am a teapot';
			res.end('Could not find it!');
			break;
	};

});
server.listen(port, () =>
{
	console.log('Listening on port ' + port);
});
