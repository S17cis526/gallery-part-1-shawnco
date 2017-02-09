/**
 * @module
 * A module for processing multipart HTTP requests
 */

 "use strict";

 module.exports = multipart;
  const DOUBLE_CRLF = Buffer.from([0x0D, 0x0A, 0x0D, 0x0A]);

 /**
  * @function multipart
  * Takes a request and response object, parses the body of the multipart
  * request and attches its content to the request object. If an error occurs
  * we log it and send a 500 status code. Otherwise we invoke next() with the
  * request and response.
  */
  function multipart(req, res, next){
    req.on('error', function(){
      console.error(err);
    })
  }

/**
  * @function processBody
  * Takes a buffer and returns a boundary and returns an associative array
  * of key/value pairs; if the content is a file, value will be an object with
  * properties filename, contentType, and data.
  */
  function processBody(buffer, boundary){
    var contents = [];
    var start = buffer.indexOf(boundary) + boundary.length + 2;
    var end = buffer.indexOf(boundary, start);

    while(end > start){
      contents.push(buffer.slice(start,end));
      start = end + boundary.length + 2;
      end = buffer.indexOf(boundary, start);
    }
    var parsedContents = {};
    content.forEach(function(content){
      parseContent(content, function(err, obj){
        if(err) return console.log(err);
        parsedContents[tuple[0]] = tuple[1]l
      });
    });
    return parsedContents;
  }

  /**
   * @function parseContent
   * Parses a content section and returns the key/value pair as a two-element
   * array
  */
  function parseContent(content, callback){
    var index = content.indexOf(DOUBLE_CLRF);
    var head = content.slice(0, index).toString();
    var body = content.slice(index + 4);
    var name = /name="([\w\d\-_]+)"/.exec(head);
    var filename = /filename="([\w\d\-_\.]+)"/.exec(head);
    var contentType = /Content-Type: ([\w\d\/]+)/.exec(head);

    if(!name) return callback('Content without name');

    if(filename){
      // we have a file
      callback(false, [name[1], {
          filename: filename[1],
          contentType: (contentType) ? contentType[1] : 'application/octet',
          data: body
        }]);
    }else{
      // We have a value
      callback(false, name[1], body.toString()]);
    }
  }
