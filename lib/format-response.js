'use strict';

module.exports = function formateResponse(data, options) {
	var isDebugMode = ( typeof options.debug !== 'undefined' ) ? options.debug : false;
  	var response = {};
  	response.statusCode = ( typeof data.statusCode !== 'undefined' ) ? data.statusCode : 500;

  	if ( typeof data.response !== 'undefined' ) {
   	delete response.statusCode;
    	response = data.response;
  	}

  	if ( typeof data.message !== 'undefined' && data.message != 'undefined' ) {
   	response.error = data.message;
  	}

  	if ( typeof data.details !== 'undefined' && typeof data.details.messages !== 'undefined' ) {
    
   	if ( typeof data.details.messages.errors === 'undefined' ) {
      	var errors = {};
        	var details = Object.keys( data.details.messages );
        	details.forEach( function( field ) {
				var message = data.details.messages[ field ][ 0 ];

				if ( message.indexOf( 'is invalid:' ) > -1 ) {
					message = message.replace( /is invalid: `/g, '' ).trim();
					var parts = message.split( '`' );

					if ( parts.length == 2 ) {
						var msg = parts[ 1 ].trim().split( ',' );

						if ( msg.length != 0 ) {
							errors[ parts[ 0 ].trim() ] = msg[ 0 ].trim();
						}
					}
				}else {
					errors[ field ] = message;
				}
			});
			response.errors = errors;
		}else{
			response.errors = data.details.messages.errors;
		}
   }

  if ( isDebugMode ) {
      response.stack = data.stack;
  }

  if ( typeof response.errors !== 'undefined' ) {
      if ( typeof response.error !== 'undefined' ) {
          delete response.error;
      }
  }

  return response;
}
