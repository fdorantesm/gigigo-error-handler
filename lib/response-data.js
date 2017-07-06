'use strict';

var cloneProperties = require( './clone.js' );
var httpStatus = require( 'http-status' );

module.exports = function responseData( err, options ) {
  var isDebugMode = options.debug;

  if ( Array.isArray( err ) && isDebugMode ) {
    err = serializeArrayOfErrors( err );
  }

  var data = Object.create( null );
  setStatusCode( data, err );

  if ( typeof err !== 'object' ) {
    err = {
      statusCode: 500,
      message: '' + err,
    };
  }

  if ( isDebugMode ) {
    setDebugData( data, err );
  } else if ( data.statusCode >= 400 && data.statusCode <= 499 ) {
    setBadRequestError( data, err );
  } else {
    setInternalError( data, err );
  }

  var safeFields = options.safeFields || [];
  setSafeFields( data, err, safeFields );
  
  return data;
};

function serializeArrayOfErrors( errors ) {
  var details = [];
  for ( var x in errors ) {
    var err = errors[ x ];

    if ( typeof err !== 'object' ) {
      details.push( '' + err );
      continue;
    }

    var data = {};
    cloneProperties( data, err );
    delete data.statusCode;
    details.push( data );
  }

  return {
    name: 'ArrayOfErrors',
    message: 'Failed with multiple errors, see `details` for more information.',
    details: details,
  };
}

function setStatusCode( data, err ) {
  data.statusCode = err.statusCode || err.status;
  if ( !data.statusCode || data.statusCode < 400 ) {
    data.statusCode = 500;
  }
}

function setDebugData( data, err ) {
  cloneProperties( data, err );
}

function setBadRequestError( data, err ) {
  data.name = err.name;
  data.message = err.message;
  data.code = err.code;
  data.details = err.details;
}

function setInternalError( data, err ) {
  data.message = httpStatus[ data.statusCode ] || 'Unknown Error';
}

function setSafeFields( data, err, safeFields ) {
  if ( !Array.isArray( safeFields ) ) {
    safeFields = [ safeFields ];
  }

  safeFields.forEach( function( field ) {
    data[ field ] = err[ field ];
  });
}
