'use strict';

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */

var multipart = require('./multipart');
var template = require('./template');
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 3002;

var config = JSON.parse(fs.readFileSync('config.json'));

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
template.loadDir('templates');

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
  fs.readFile('images/' + decodeURIComponent(filename), function(err, data){
    if(err) {
      console.error(err);
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'image/*');
    res.end(data);
  });
}

// Compiles the gallery HTML together
function buildGallery(imageTags){
    return template.render('gallery', {title: config.title, imageTags: imageTags});

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

function uploadImage(req, res) {
  multipart(req, res, function(req, res) {
    // make sure an image was uploaded
    console.log('filename', req.body.filename)
    if(!req.body.image.filename) {
      console.error("No file in upload");
      res.statusCode = 400;
      res.statusMessage = "No file specified"
      res.end("No file specified");
      return;
    }
    fs.writeFile('images/' + req.body.image.filename, req.body.image.data, function(err){
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.statusMessage = "Server Error";
        res.end("Server Error");
        return;
      }
      serveGallery(req, res);
    });
  });
}

function handleRequest(req, res) {
  // at most, the url should have two parts -
  // a resource and a querystring separated by a ?
  var urlParts = url.parse(req.url);

  if(urlParts.query){
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if(matches && matches[1]){
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
  }

  switch(urlParts.pathname) {
    case '/':
    case '/gallery':
      if(req.method == 'GET') {
        serveGallery(req, res);
      } else if(req.method == 'POST') {
        uploadImage(req, res);
      }
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      serveImage(req.url, req, res);
  }
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

var server = http.createServer(handleRequest);
server.listen(port, function(){
	console.log('Server is listening on port ', port);
});

