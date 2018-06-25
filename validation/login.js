const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateUserLoginInput(data) {
	let errors = {};

	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';

	if (Validator.isEmpty(data.email)) {
		errors.email = 'E-mail is required';
	}
	if (!Validator.isEmail(data.email)) {
		errors.email = 'E-mail is invalid';
	}
	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password is required';
	}
	if (!Validator.isLength(data.password, { min: 5, max: 30 })) {
		errors.password = 'Password must be between 5 and 30 characters';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	}
};
