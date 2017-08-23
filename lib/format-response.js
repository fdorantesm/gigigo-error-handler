'use strict';

module.exports = function formateResponse( data, options) {
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
        statusCode: (typeof data.statusCode !== 'undefined') ? data.statusCode : 500
    };

    if(typeof data.response !== 'undefined'){
        delete response.statusCode;
        response = data.response
    }

    var isDebugMode = options.debug;

    if( typeof data.message !== 'undefined' && data.message != 'undefined') {
        response.error = data.message;
    }

    if( typeof data.details !== 'undefined' && typeof data.details.messages !== 'undefined'){
        var keys = Object.keys(data.details.messages);
        if( keys.length > 0){
            var errors = {};
            Object.keys(data.details.messages).forEach(function(e){
                let error = data.details.messages[e][0];
                errors[e] = error;
            });
            response.errors = errors;
        }
    }

    if (isDebugMode)
        response.stack = data.stack;

    if(typeof response.errors !== 'undefined'){
        if( typeof response.error !== 'undefined'){
            delete response.error;
        }
    }

    return response;
}