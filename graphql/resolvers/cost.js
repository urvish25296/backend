const Cost = require('../../model/Charges');

module.exports = {
	Query    : {},

	Mutation : {
		async createCost (_, { cost }) {
			const newCost = new Cost({ cost });

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
