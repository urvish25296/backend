const { model, Schema } = require('mongoose');

module.exports = model(
	'Bookings',
	new Schema({
		parkingSport : String,
		bookingDate  : String,
		numOfHours   : Number
	})
);
