const userResolver = require('./user');
const parkingSpotsResolver = require('./parkingspots');
const costResolver = require('./cost');
module.exports = {
	Query    : {
		...userResolver.Query,
		...parkingSpotsResolver.Query,
		...costResolver.Query
	},

	Mutation : {
		...userResolver.Mutation,
		...parkingSpotsResolver.Mutation,
		...costResolver.Mutation
	}
};
