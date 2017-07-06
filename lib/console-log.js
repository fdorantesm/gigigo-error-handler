'use strict';

var format = require( 'util' ).format;
var globalize = require( 'strong-globalize' )();

function formatError( err ) {
  return format( '%s', ( err.stack || err ) );
}

module.exports = function consoleLog( req, err ) {
  if ( !Array.isArray( err ) ) {
    globalize.error( 'Unhandled error for request %s %s: %s', req.method, req.url, ( err.stack || err ) );

    return;
  }

  var errMsg = globalize.f( 'Unhandled array of errors for request %s %s\n', req.method, req.url );
  var errors = err.map( formatError ).join( '\n' );
  
  console.error( errMsg, errors );
}
