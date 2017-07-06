'use strict';

module.exports = function cloneProperties( data, err ) {
	data.name = err.name;
	data.message = err.message;

	for ( var pos in err ) {
		if ( ( pos in data ) ) { 
			continue;
		}
		
		data[ pos ] = err[ pos ];
	}
	
	data.stack = err.stack;
};
