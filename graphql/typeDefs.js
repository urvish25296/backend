const { gql } = require('apollo-server');

module.exports = gql`
	type User {
		id: ID!
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		phonenumber: String!
	}

	type ParkingSpot {
		id: ID!
		parkingsportname: String!
		avalible: Boolean!
	}

	type Booking {
		id: ID!
		bookingDate: String!
		startingtime: Int!
		endingtime: Int!
		createdDate: String
	}

	type Cost {
		id: ID!
		amount: Int!
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
	}

	type Mutation {
		# USER
		createUser(userInput: UserInput): User!
		login(email: String!, password: String!): User!
		#updateUser(updateUserInput: UpdateUserInput): User!

		# PARKINGSPORTS
		createParkingSport(parkingsportname: String!, avalible: Boolean!): ParkingSpot!
		createCost(costInput: CostInput): Cost!
	}
`;
