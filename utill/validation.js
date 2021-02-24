module.exports.validateUserInput = (firstname, lastname, email, password, phonenumber) => {
	const errors = {};

	if (firstname.trim() === '') {
		errors.username = 'Firstname must not be empty';
	}

	if (lastname.trim() === '') {
		errors.username = 'Lastname must not be empty';
	}

	if (email.trim() === '') {
		errors.email = 'Email must not be empty';
	}
	else {
		const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
		if (!email.match(regEx)) errors.email = 'Email must be valid email address';
	}

	if (password === '') {
		errors.password = 'Password must not be empty';
	}

	if (phonenumber === '') {
		errors.password = 'Password must not be empty';
	}

	return {
		errors,
		valid  : Object.keys(errors).length < 1
	};
};
