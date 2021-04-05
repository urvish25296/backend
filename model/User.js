const { model, Schema } = require('mongoose');
module.exports = model(
	'User',
	new Schema({
		firstname   : String,
		lastname    : String,
		email       : String,
		password    : String,
		phonenumber : String,
		isAdmin     : Boolean
	})
);
