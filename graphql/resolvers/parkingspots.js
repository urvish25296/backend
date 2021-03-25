const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const { validateParkingSport } = require('../../utill/validation');
const jwt = require('jsonwebtoken');
const ParkingSpots = require('../../model/ParkingSpots');

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
		async getParkingSports () {
			const parkingspots = await ParkingSpots.find();
			return parkingspots;
		},

		async getParkingSport (_, { id }) {
			const parkinggsport = await ParkingSpots.findById(id);
			return parkinggsport;
		}
	},

	Mutation : {
		async createParkingSport (_, { parkingsportname, avalible }) {
			const parkingSport = await ParkingSpots.findOne({ parkingsportname });
			const { valid, errors } = validateParkingSport(parkingsportname);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			//CHECK parkingSport IS EXIST OR NOT
			if (parkingSport)
				throw new UserInputError('This parkingSport name is already exist', {
					parkingsportname : 'This parkingSport name is already exist'
				});

			const newParkingSport = new ParkingSpots({ parkingsportname, avalible });

			const res = await newParkingSport.save();
			const token = generateToken(res);
			return {
				...res._doc,
				id    : res._id,
				token
			};
		}
	}
};
