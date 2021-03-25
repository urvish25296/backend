const userResolver = require('./user');
const parkingSpotsResolver = require('./parkingspots');
module.exports = {
	Query    : {
		...userResolver.Query,
		...parkingSpotsResolver.Query
	},

	Mutation : {
		...userResolver.Mutation,
		...parkingSpotsResolver.Mutation
	}
};
