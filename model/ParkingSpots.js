const { model, Schema } = require('mongoose');
module.exports = model(
	'ParkingSpots',
	new Schema({
		parkingsportname : String,
		avalible         : Boolean,
		cost             : String,
		status           : Boolean
	})
);
