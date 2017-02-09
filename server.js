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

// Resource files for the images
var ace = fs.readFileSync('images/ace.jpg');
var bubble = fs.readFileSync('images/bubble.jpg');
var chess = fs.readFileSync('images/chess.jpg');
var fern = fs.readFileSync('images/fern.jpg');
var mobile = fs.readFileSync('images/mobile.jpg');

// Resource for the stylesheet
var stylesheet = fs.readFileSync('gallery.css');

// Retrieve all image file names
function getImageNames(callback){
	fs.readdir('images', function(err, fileNames){
		if(err){
			callback(err, undefined);
		}else{
			callback(false, fileNames);
		}
	});
}

// Convert image name to tags
function imageNamesToTags(fileNames){
	return fileNames.map(function(fileName){
		return `<img src="${fileName}" alt="${fileName}" />`;
	});
}


// Give the image
function serveImage(filename, req, res)
{
	var data = fs.readFile('images/' + filename, function(err, data)
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
		res.end(data);
	});

}

// Compiles the gallery HTML together
function buildGallery(imageTags){
      var gHtml = imageNames.map(function(fileName)
      {
       	return '<img src="' + fileName + '" />';
      }).join(' ');            
		var html = '<!doctype html>';
		html += '<html><head><title>Dynamic Page</title>';
      html += '<link rel="stylesheet" href="gallery.css" type="text/css" />';
      html += '</head><body>';
		html += '<h1>Gallery</h1>';
      html += gHtml;
      html += '<h1>Hai</h1> Time is  ' + Date.now();
		html += '</body></html>';
		return html;
}

// Serve the gallery page
function serveGallery(req, res){
		getImageNames(function(err, imageNames){
			if(err) {
				console.log(err);
				res.statusCode = 500;
				res.statusMessage = 'Server error';
				res.end();
				return;
			}
			res.setHeader('Content-Type', 'text/html');
			res.end(buildGallery(imageNames));			
		});
}

var server = http.createServer((req, res) =>
{
	switch (req.url)
	{
		// Gallery page
		case '/':
		case '/gallery':
			serveGallery(req, res);
			break;
			
		// Gallery CSS
   	case '/gallery.css':
      	res.setHeader('Content-Type', 'text/css');
      	res.end(stylesheet);
      	break;		
		default:
			serveImage(req.url, req, res);
			break;
	};

});
server.listen(port, () =>
{
	console.log('Listening on port ' + port);
});
