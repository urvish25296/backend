const { model, Schema } = require('mongoose');

module.exports = model(
	'Bookings',
	new Schema({
		userid       : String,
		parkingSport : String,
		bookingDate  : String,
		numOfHours   : Number,
		total        : Number,
		isPaid       : Boolean
	})
);
