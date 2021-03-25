const { model, Schema } = require('mongoose');

module.exports = model(
	'Charges',
	new Schema({
		cost : Number
	})
);
