const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: ID!
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		phonenumber: String!
		isAdmin: Boolean!
		status: Boolean!
	}

	type ParkingSpot {
		id: ID!
		parkingsportname: String!
		avalible: Boolean!
		cost: Int!
		status: Boolean!
	}

	type Cost {
		id: ID!
		amount: Int!
	}

	type Booking {
		id: ID!
		userid: String!
		parkingSport: String!
		bookingDate: String!
		numOfHours: Int!
		total: Int!
		isPaid: Boolean!
	}

	input CostInput {
		amount: Int!
	}

	input UserInput {
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		phonenumber: String!
		isAdmin: Boolean!
		status: Boolean!
	}

	input UpdateUserInput {
		id: ID!
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		phonenumber: String!
	}

	type Query {
		# USER
		getUsers: [User]
		# PARKINGSPORTS
		getParkingSports: [ParkingSpot]
		getParkingSport(id: ID!): ParkingSpot!
		getCosts: [Cost]
		getCost(id: ID!): Cost!
		#booking
		getBookings: [Booking]
	}

	input BookingInput {
		userid: String!
		parkingSport: String!
		bookingDate: String!
		numOfHours: Int!
		total: Int!
		isPaid: Boolean!
	}

	type Mutation {
		# USER
		createUser(userInput: UserInput): User!
		login(email: String!, password: String!): User!
		updateUser(updateUserInput: UpdateUserInput): User!
		changeUserStatus(id: ID!): User!
		# PARKINGSPORTS
		createParkingSport(parkingsportname: String!, avalible: Boolean!, cost: Int!, status: Boolean): ParkingSpot!
		changeParkingSpotStatus(id: ID!): ParkingSpot!
		createCost(costInput: CostInput): Cost!
		createBooking(bookingInput: BookingInput): Booking!
	}
`;
