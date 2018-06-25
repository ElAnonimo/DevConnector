const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const keys = require('../../config/keys');

// load input validation
const validateUserRegisterInput = require('../../validation/register');
const validateUserLoginInput = require('../../validation/login');

// create user
router.post('/register', (req, res) => {
	const { errors, isValid } = validateUserRegisterInput(req.body);
	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user) {
				// return res.status(400).json({ email: 'E-mail already exists' });
				errors.email = 'E-mail already exists';
				return res.status(400).json(errors);
			} else {
				const userpic = gravatar.url(req.body.email, {
					s: '200', 		// size
					r: 'pg',			// rating
					d: 'mm'				// default userpic. 'mm' inserts a 'mystery man' placeholder
				});

				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					userpic,
					password: req.body.password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
							.then((user) => res.json(user))
							.catch((err) => console.log('couldn\'t save user:', err));
					});
				});
			}
		});
});

// returns a JWT along with a logged in user. JWT is used to access protected routes
router.post('/login', (req, res) => {
	const { errors, isValid } = validateUserLoginInput(req.body);
	// check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email })
		.then((user) => {
			if (!user) {
				errors.email = 'user not found';
				return res.status(404).json(errors);
			}

			// user.password is the hashed one from when registered a user, line 30
			bcrypt.compare(password, user.password)
				.then((isMatch) => {
					if (isMatch) {
						const payload = {
							id: user.id,
							name: user.name,
							userpic: user.userpic
						};

						jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 * 60 }, (err, token) => {		// 60 * 60 sec.
							res.json({
								success: true,
								token: 'Bearer ' + token
							});
						});
					} else {
						errors.password = 'password incorrect';
						return res.status(400).json(errors);
					}
				});
		});
});

router.get('/current_user', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.send(req.user);		// user put on req by JwtStrategy in passport.js, line 18
});

module.exports = router;
