'use strict';

var accepts = require('accepts');
var debug = require('debug')('strong-error-handler:http-response');
var util = require('util');

var sendJson = require( './send-json' );
var sendHtml = require( './send-html' );
var sendXml = require( './send-xml' );

module.exports = function contentProducer( req, warningLog, options ) {
  options = options || {};
  var SUPPORTED_TYPES = [ 'application/json', 'json', 'text/html', 'html', 'text/xml', 'xml' ];
  var defaultType = 'json';

  if ( options.defaultType ) {
    if ( SUPPORTED_TYPES.indexOf( options.defaultType ) > -1 ) {
      debug( 'Accepting options.defaultType `%s`', options.defaultType );
      defaultType = options.defaultType;
    } else {
      debug( 'defaultType: `%s` is not supported, falling back to defaultType: `%s`', options.defaultType, defaultType );
    }
  }

  var resolvedContentType = accepts( req ).types( SUPPORTED_TYPES );
  debug( 'Resolved content-type', resolvedContentType );
  var contentType = resolvedContentType || defaultType;
  var query = req.query || {};

  if ( query._format ) {
    if ( SUPPORTED_TYPES.indexOf( query._format ) > -1 ) {
      contentType = query._format;
    } else {
      var msg = util.format( 'Response _format "%s" is not supported used "%s" instead"', query._format, defaultType );
      warningLog( msg );
    }
  }

  debug( 'Content-negotiation: req.headers.accept: `%s` Resolved as: `%s`', req.headers.accept, contentType );
  return resolveOperation( contentType );
}

function resolveOperation( contentType ) {
  switch ( contentType ) {
    case 'application/json':
    case 'json':
      return sendJson;
    case 'text/html':
    case 'html':
      return sendHtml;
    case 'text/xml':
    case 'xml':
      return sendXml;
  }
}
