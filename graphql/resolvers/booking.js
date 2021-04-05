const bcrypt = require('bcryptjs');
const ParkingSpots = require('../../model/ParkingSpots');
const Booking = require('../../model/Bookings');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const jwt = require('jsonwebtoken');

function generateToken (user) {
	return jwt.sign(
		{
			id       : user.id,
			email    : user.email,
			username : user.username
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}

module.exports = {
	Query    : {
		async getBookings () {
			const booking = await Booking.find();
			return booking;
		}
	},

	Mutation : {
		async createBooking (_, { bookingInput: { parkingSport, bookingDate, numOfHours } }) {
			const newBooking = new Booking({
				parkingSport,
				bookingDate,
				numOfHours
			});

			ParkingSpots.findOneAndUpdate({ _id: parkingSport }, { avalible: false }).then((objs) => {
				console.log('SUCCESS');
				console.log(objs);
			});

			const res = await newBooking.save();
			const token = generateToken(res);

			return {
				...res._doc,
				id    : res._id,
				token
			};
		}
	}
};