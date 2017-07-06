'use strict';

var js2xmlparser = require('js2xmlparser');

module.exports = function sendXml( res, data ) {
  let content = js2xmlparser.parse( data );
  
  res.setHeader( 'Content-Type', 'text/xml; charset=utf-8' );
  res.end( content, 'utf-8' );
};
