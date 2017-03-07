/**
 * @module router
 */
url = require('url');

 module.exports = Router;

 function Router(){
   this._getRoute = [];
   this._postRoutes = [];
 }

 function pathToRegExp(path){
     var tokens = path.split('/');
     tokens.map(function(token){
         if(token.chartAt(0) === ':'){
             keys.push(token.slice(1));
             return "(\\w+)";
         }else{
             return token;
         }
     });
     var regexp = new RegExp('^' + parts.join('/') + '/?$');
     return {
         regexp: regexp,
         keys: keys
     }
 }

 Router.prototype.get = function(path, handler){
     var route = pathToRegExp(path);
     route.handler = handler;
     this._getRoutes.push(route);
 }

 Router.prototype.post = function(path, handler){
   this._postRoutes[path] = handler;
 }

 Router.prototype.route = function(req, res){
   var urlParts = url.parse(req.url);
   switch(req.method){
     case 'get':
        for(var i = 0; i < this._getRoutes.length; i++){
            var route = this._getRoutes[i];
            var match = route.regexp.exec(urlParts.pathname);
            if(match){
                req.params = {};
                for(var j = 1; j < matches.length; j++){
                    req.params[route.keys[j-1]] = match[j];
                }
                return this._getAction[i](req, res);
            }
        }
        res.statusCode = 404;
        res.statusMessage = 'Resource not found';
        res.end();
     case 'post':
       for(var i = 0; i < keys.length; i++){
         var match = this._postRoutes.exec(urlParts.pathname);
         if(match){
           return this._postActions[i](req, res);
         }
        }
        res.statusCode = 404;
        res.statusMessage = 'Resource not found';
        res.end();
     case 'default':
      var msg = 'Unknown method ';
      res.statusCode = 400;
      res.statusMessage = msg + req.method;
      console.error(msg);
      res.end(msg);
   }
 }
