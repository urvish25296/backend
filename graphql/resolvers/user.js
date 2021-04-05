const bcrypt = require('bcryptjs');
const User = require('../../model/User');
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
		async getUsers () {
			const user = await User.find();
			return user;
		}
	},

	Mutation : {
		//Create user (ADD FORM)
		async createUser (_, { userInput: { firstname, lastname, email, password, phonenumber, isAdmin } }, context) {
			const user = await User.findOne({ email });

			//VALIDATION
			const { valid, errors } = validateUserInput(firstname, lastname, email, password, phonenumber, isAdmin);

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
				phonenumber,
				isAdmin
			});

			//SAVE USER INTO DATABASE
			const res = await newUser.save();
			const token = generateToken(res);
			return {
				...res._doc,
				id    : res._id,
				token
			};
		},
		//LOGIN FORM
		async login (_, { email, password }) {
			const { errors, valid } = validateLoginInput(email, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}

			const user = await User.findOne({ email });

			if (!user) {
				errors.general = 'User not found';
				throw new UserInputError('User not found', { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = 'Wrong crendetials';
				throw new UserInputError('Wrong crendetials', { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id    : user._id,
				token
			};
		},

		async updateUser (_, { updateUserInput: { id, firstname, lastname, email, password, phonenumber } }, context) {
			const res = await User.findOneAndUpdate(
				{ _id: id },
				{
					firstname   : firstname,
					lastname    : lastname,
					email       : email,
					password    : password,
					phonenumber : phonenumber
				}
			);

			const token = generateToken(res);

			return {
				...res._doc,
				id    : res._id,
				token
			};
		}
	}
};
