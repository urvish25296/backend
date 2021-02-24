const bcrypt = require('bcryptjs');
const User = require('../../model/User');
const { UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const { validateUserInput } = require('../../utill/validation');
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
		sayHi : () => 'Hello world'
	},

	Mutation : {
		async createUser (_, { userInput: { firstname, lastname, email, password, phonenumber } }, context) {
			const user = await User.findOne({ email });

			//VALIDATION
			const { valid, errors } = validateUserInput(firstname, lastname, email, password, phonenumber);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			//CHECK USER IS EXIST OR NOT
			if (user)
				throw new UserInputError('This email is taken', {
					username : 'This username is taken'
				});

			//PASSWORD ENCRYPTION
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				firstname,
				lastname,
				email,
				password,
				phonenumber
			});

			//SAVE USER INTO DATABASE
			const res = await newUser.save();
			const token = generateToken(res);
			return {
				...res._doc,
				id    : res._id,
				token
			};
		}
	}
};
