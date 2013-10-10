var mongoose = require('mongoose');

exports.model = mongoose.model(
	'Interest', 
	{ 
		title: String,
		votes: {type: Number, default: 0}
	}
);
