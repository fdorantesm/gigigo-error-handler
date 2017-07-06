'use strict';

var path = require( 'path' );
var debug = require( 'debug' )( 'gigigo-error-handler' );
var format = require( 'util' ).format;
var SG = require( 'strong-globalize' );

var responseData = require( './response-data' );
var consoleLog = require( './console-log' );
var contentProducer = require( './content-producer' );

SG.SetRootDir( path.resolve( __dirname, '..' ) );

function noop() {}

exports = module.exports = function createGigigoErrorHandler( options ) {
  options = options || {};
  debug( 'Initializing handler with options %j', options );

  var errorLog = ( options.log !== false ) ? consoleLog : noop;

  return function gigigoErrorHandler( err, req, res, next ) {
    debug( 'Handling %s', err.stack || err );
    errorLog( req, err );

    if ( res._header ) {
      debug( 'Response was already sent, closing the underlying connection' );
      return req.socket.destroy();
    }

    if ( !err.status && !err.statusCode && res.statusCode >= 400 ) {
      err.statusCode = res.statusCode;
    }

    var data = responseData( err, options );
    debug( 'Response status %s data %j', data.statusCode, data );

    res.setHeader( 'X-Content-Type-Options', 'nosniff' );
    res.statusCode = data.statusCode;

    var sendResponse = contentProducer( req, warn, options );
    sendResponse( res, data );

    function warn( msg ) {
      res.header( 'X-Warning', msg );
      debug( msg );
    }

  };
  
}
