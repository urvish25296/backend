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

	type Charges {
		id: ID!
		cost: Int!
	}

	type Query {
		# USER
		getUsers: [User]
		# PARKINGSPORTS
		getParkingSports: [ParkingSpot]
		getParkingSport(id: ID!): ParkingSpot!
	}

	type Mutation {
		# USER

		createUser(userInput: UserInput): User!
		login(email: String!, password: String!): User!
		#updateUser(updateUserInput: UpdateUserInput): User!

		# PARKINGSPORTS
		createParkingSport(parkingsportname: String!, avalible: Boolean!): ParkingSpot!
		createCost(cost: Int!): Charges!
	}
`;
