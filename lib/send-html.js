'use strict';

var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var assetDir = path.resolve( __dirname, '../views' );
var defaultLayout = 'default-error.ejs';
var compiledTemplates = {
  default: loadDefaultTemplate(),
};

function compileTemplate( filepath ) {
  let options = { 
    cache: true, 
    filename: filepath 
  };
  let fileContent = fs.readFileSync( filepath, 'utf8' );
  
  return ejs.compile( fileContent, options );
}

function loadDefaultTemplate() {
  let defaultTemplate = path.resolve( assetDir, defaultLayout );

  return compileTemplate( defaultTemplate );
}

function sendReponse( res, body ) {
  res.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
  res.end( body );
}

module.exports = function sendHtml(res, data, options) {
  var toRender = {
    options: {}, 
    data: data
  };
  var body = compiledTemplates.default( toRender );

  sendReponse( res, body );
};
