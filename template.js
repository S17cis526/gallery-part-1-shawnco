/**
 * @module template
 */
module.exports = {
    render: render,
    loadDir: loadDir
}

var fs = require('fs');

/**
 * @function loadDir
 * Loads a directory of templates
 * @param {string} directory - the directory to load
 */
function loadDir(directory){
    var template = [];
    var dir = fs.readdirSync(directory);
    dir.forEach(function(file){
        console.log(file);
        var stats = fs.statSync(directory + '/' + file);
        if(stats.isFile()){
            templates[file] = fs.readFileSync(directory + '/' + file).toString();
        }
    })
}

/**
 * @function render
 * Renders a template with embedded Javascript
 * @param {string} templateName - the template to render
 * @param {object} context - the data relevant to the page
 */
function render(templateName, context){
    templates[templateName].replace(/\$\$(.+)\$\$/g, function(match, js){
        if(js === 'imageTags'){
            // Turn it into a list of images
            return context[js].map(function(filename){
                return `<img src="${filename}" alt="${filename}" />`;
            });
        }
        else{
            return context[js];
        }
    });
}