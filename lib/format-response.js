'use strict';

module.exports = function formateResponse( data ) {
    let tmp = {
        statusCode: data.statusCode
    };

    if ( !data.details ) {
        tmp.error = data.message;
    } else {
        let list = [];
        for ( let prop in data.details.messages ) {
            if ( prop !== "add" ) {
                list[ prop ] = ( data.details.messages[ prop ][ 0 ] ) ? data.details.messages[ prop ][ 0 ] : 'Error not defined.';
            }
        }
        tmp.errors = Object.assign( {}, list );
    }

    return tmp;
}