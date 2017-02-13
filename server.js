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

// Config file
var configJsonString = fs.readFileSync('config.json', {'encoding': 'utf-8'});
var config = JSON.parse(configJsonString);
var title = config['title'];

// Resource for the stylesheet
var stylesheet = fs.readFileSync('gallery.css');

function saveConfig(){
	var data = JSON.stringify(config);
	fs.writeFile('config.json', data, function(err){
		console.error('Error saving config file', err);
	});
}

// Handle errors
function handleError(req, res, err){
	console.err(err, req, res);
	res.writeHead(500, {'Content-Type': 'text/html'});
	res.end('Server Error');
}

function handleRequest(req, res){
	if(req.url == '/') buildGallery(req, res);
	else if(req.substring(0,8) == '/images/') sendImage(req, res);
	else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end('not found');
	}
}

function enumerateImageFiles(req, res){
	fs.readdir('images', function(err, items){
		if(err) { handleError(req, res, err); return; }
		var toProcess = items.length;
		var files = [];
		items.each(function(item){
			item.stats(function(err,stats){
				if(err) console.error(err);
				else if(stats.isFile()) files.push(item);
				toProcess--;
				if(toProcess == 0) buildGallery(req, res, files);
			}
		}
	});
}		



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
	/*var data = fs.readFile('images/' + filename, function(err, data)
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
	});*/
	var filename = './' + req.url;
	fs.stat(filename, function(err, stats){
		if(err){handleError(req, res, err); return;}
		if(stats.isFile()){
			fs.readFile(filename, function(err, file){
				if(err){handleError(req, res, err); return;}
				res.writeHead(200, {'Content-Type': 'text/' + filename.split('.').last});
				res.end(file);
			});
		}
	});
}

}

// Compiles the gallery HTML together
function buildGallery(req, res, images){
      /*var gHtml = imageNames.map(function(fileName)
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
		return html;*/
	images.map(function(file){
		return "<img src='/images/" + file "'/>";
	}).join("\n");
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(
		'<!doctype html>' +
		'<html><head><title>Photo Gallery</title></head><body>' +
		'<h1>Photo Gallery</h1>' + images + '</body></html>');
}

// Serve the gallery page
function serveGallery(req, res){
	/*if(req.query.title){
		title = query.title;
		config.title = query.title;
		saveConfig();
	}*/
	if(data && data.title){
		title = data.title;
		config.title = data.title;
		saveConfig();
	}

	fs.readdir('images', function(err, files){
		if(err){
			console.error('Error in serveGallery', err);
			res.writeHead(500, {'Content-Type': 'text/html'});
			res.end('Server Error');
			return;
		}
		var imageTags = files.filter(function(file){
			return fs.statSync('images/'+file).isFile();
		}).map(function(file){
			return "<img src='/images/"+file+"'/>";
		}).join("\n");
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(
			'<!doctype><html><head><title>' + title + '</title><link href="gallery.css" type="text/css" rel="stylesheet"/></head><body><h1>' + title + '</h1>' + generateTitleForm() + '<div class="gallery">' + imageTags + '</div></body></html>.');
	});
}
		/*getImageNames(function(err, imageNames){
			if(err) {
				console.log(err);
				res.statusCode = 500;
				res.statusMessage = 'Server error';
				res.end();
				return;
			}
			res.setHeader('Content-Type', 'text/html');
			res.end(buildGallery(imageNames));			
		});*/
}

function generateTitleForm(){
	return '<form action="/" method="POST"><input type="text" name="title" value="' + title + '"><input type="submit" value="Save Changes"/></form>';

function parsePostData(req, res, callback){
	if(request.method.toUpperCase() != 'POST') return callback(req, res);
	var body = '';
	req.on('data', function(data){
		body += data;
		if(body.length > config.maxUploadSizeInMB * Math.pow(10,6))
			request.connection.destroy();
	});
	req.on('end', function(){
		var data = qs.parse(body);
		callback(req, res, query, data);
	});
}

function generateImageForm(){
	'<form enctype="multipart/form-data" action="/" method="POST"><input type="file" name="image"><input type="submit" value="Upload Image"></form>';
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
/*server.listen(port, () =>
{
	console.log('Listening on port ' + port);
});*/
var server = new http.Server(function(req, res){
	var resource = req.url.split('?')[0];
	req.query = querystring.parse(req.url.split('?')[1]);
	switch(resource){
		case '/':
			parsePostData(req, res, serveGallery);
			break;
		case '/favicon.ico':
			req.writeHead(400);
			req.end();
			break;
		case '/gallery.css';
			serveCSS(req, res);
			break;
		default:
			serveImage(req, res);
			break;
}).listen(80);
