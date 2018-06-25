const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		console.log('jwt_payload:', jwt_payload);

		User.findById(jwt_payload.id)
			.then((user) => {
				if (user) {
					return done(null, user);		// null for error
				}

				return done(null, false);			// false cause no user
			})
			.catch((err) => console.log('couldn\'t find user:', err));
	}));
};
