'use strict';

module.exports = function formateResponse( data, options ) {

    /*
    {
        statusCode: ,
        name: 'ValidationError',
        message: 'The `Fuel` instance is not valid. Details: `fuelKey` is not unique (value: "string").',
        details:
        {
            context: 'Fuel',
            codes: { field: [message] },
            messages: Errors { field: [message] }
        }
    }
    */
    var response = {
        statusCode: data.statusCode
    };

    var isDebugMode = options.debug;

    if( typeof data.message !== undefined && data.message != 'undefined') {
        response.error = data.message;
    }

    if( typeof data.details !== undefined && data.details.messages !== undefined){
        var errors = {};
        Object.keys(data.details.messages).forEach(function(e){
            let error = data.details.messages[e][0];
            errors[e] = error;
        });
        response.errors = errors;
    }

    if (isDebugMode)
        response.stack = data.stack;

    return response;
}
