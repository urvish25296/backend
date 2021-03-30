const { model, Schema } = require('mongoose');

module.exports = model(
	'Cost',
	new Schema({
		amount : Number
	})
);
