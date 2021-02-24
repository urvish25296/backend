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

	type Query {
		sayHi: String!
	}

	input UserInput {
		firstname: String!
		lastname: String!
		email: String!
		password: String!
		phonenumber: String!
	}

	type Mutation {
		createUser(userInput: UserInput): User!
	}
`;
