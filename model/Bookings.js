const { model, Schema } = require('mongoose');

module.exports = model(
	'Bookings',
	new Schema({
		parkingSportId : String,
		bookingDate    : Date,
		startingtime   : Number,
		endingtime     : Number,
		createdDate    : Datetime
	})
);
