'use strict';

module.exports = function sendJson( res, data ) {
  let content = JSON.stringify( data );

  res.setHeader( 'Content-Type', 'application/json; charset=utf-8' );
  res.end( content, 'utf-8' );
};

