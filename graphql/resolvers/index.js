const userResolver = require('./user');
const parkingSpotsResolver = require('./parkingspots');
const costResolver = require('./cost');
const bookingResolver = require('./booking');
module.exports = {
	Query    : {
		...userResolver.Query,
		...parkingSpotsResolver.Query,
		...costResolver.Query,
		...bookingResolver.Query
	},
	Mutation : {
		...userResolver.Mutation,
		...parkingSpotsResolver.Mutation,
		...costResolver.Mutation,
		...bookingResolver.Mutation
	}
};
