const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const prependHttp = require('prepend-http');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// get profile for logged in user
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.user.id })
		.populate('user', ['name', 'userpic'])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'No profile found for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

// get all profiles
router.get('/all', (req, res) => {
	const errors = {};

	Profile.find({})
		.populate('user', ['name', 'userpic'])
		.then((profiles) => {
			if (!profiles) {
				errors.noprofile = 'There are no profiles in the DB';
				return res.status(404).json(errors);
			}

			res.json(profiles);
		})
		.catch((err) => res.status(404).json(err));
});

// get profile by handle
router.get('/handle/:handle', (req, res) => {
	const errors = {};

	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'userpic'])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

// get profile by user id
router.get('/user/:user_id', (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'userpic'])
		.then((profile) => {
			if (!profile) {
				errors.noprofile = 'There is no profile for this user';
				return res.status(404).json(errors);
			}

			res.json(profile);
		})
		.catch((err) => res.status(404).json(err));
});

// create or update profile
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateProfileInput(req.body);
	// check validation
	if (!isValid) {
		// return any errors with 400 status
		return res.status(400).json(errors);
	}

	// get profile fields
	const profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle) profileFields.handle = req.body.handle;
	if (req.body.company) profileFields.company = req.body.company;
	if (req.body.website) profileFields.website = prependHttp(req.body.website, { https: true });
	if (req.body.location) profileFields.location = req.body.location;
	if (req.body.status) profileFields.status = req.body.status;
	if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
	if (req.body.bio) profileFields.bio = req.body.bio;
	// skills - array, need to split by comma
	if (typeof req.body.skills !== 'undefined') {
		profileFields.skills = req.body.skills.split(',');
	}
	// social
	profileFields.social = {};
	if (req.body.youtube) profileFields.social.youtube = prependHttp(req.body.youtube, { https: true });
	if (req.body.twitter) profileFields.social.twitter = prependHttp(req.body.twitter, { https: true });
	if (req.body.facebook) profileFields.social.facebook = prependHttp(req.body.facebook, { https: true });
	if (req.body.linkedin) profileFields.social.linkedin = prependHttp(req.body.linkedin, { https: true });
	if (req.body.instagram) profileFields.social.instagram = prependHttp(req.body.instagram, { https: true });

	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			if (profile) {		// if there is a profile on req then this is a profile update
				Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
					.then((profile) => res.json(profile));
			} else {					// no profile on req, create new profile
				// check if handle exists. No duplicate handles
				// const errors = {};
				Profile.findOne({ handle: profileFields.handle })
					.then((profile) => {
						if (profile) {
							errors.handle = 'That handle already exists';
							res.status(400).json(errors);
						}

						// create
						new Profile(profileFields).save()
							.then((profile) => res.json(profile));
					});
			}
		});
});

// add experience to profile
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateExperienceInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const newExperience = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// add to experience array on profile
			profile.experience.unshift(newExperience);		// add to beginning of array

			profile.save().then((profile) => res.json(profile));
		});
});

// add education to profile
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validateEducationInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			const newEducation = {
				school: req.body.school,
				degree: req.body.degree,
				'field of study': req.body['field of study'],
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// add to experience array on profile
			profile.education.unshift(newEducation);		// add to beginning of array

			profile.save().then((profile) => res.json(profile));
		});
});

// delete experience from profile
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			// get remove experience index
			const removeIndex = profile.experience
				.map((exp) => exp.id)
				.indexOf(req.params.exp_id);

			// splice experience out of profile.experience array
			profile.experience.splice(removeIndex, 1);

			profile.save().then((profile) => res.json(profile));
		})
		.catch((err) => res.status(404).json(err));
});

// delete education from profile
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			// get remove education index
			const removeIndex = profile.education
				.map((edu) => edu.id)
				.indexOf(req.params.edu_id);

			// splice education out of profile.education array
			profile.education.splice(removeIndex, 1);

			profile.save().then((profile) => res.json(profile));
		})
		.catch((err) => res.status(404).json(err));
});

// delete profile and user
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndRemove({ user: req.user.id })
		.then(() => {
			User.findOneAndRemove({ _id: req.user.id })
				.then((res) => res.json({ success: true }));
		});
});

module.exports = router;
