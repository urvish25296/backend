const bcrypt = require('bcryptjs');
const Cost = require('../../model/Cost');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const { validateUserInput, validateLoginInput } = require('../../utill/validation');
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
		async getCosts () {
			const costs = await Cost.find();
			return costs;
		},

		async getCost (_, { id }) {
			const cost = await Cost.findById(id);
			return cost;
		}
	},

	Mutation : {
		//Create Cost
		async createCost (_, { costInput: { amount } }, context) {
			const newCost = new Cost({
				amount
			});

			//SAVE USER INTO DATABASE
			const res = await newCost.save();
			const token = generateToken(res);
			return {
				...res._doc,
				id    : res._id,
				token
			};
		}
	}
};
