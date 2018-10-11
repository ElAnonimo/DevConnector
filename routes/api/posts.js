const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const validatePostInput = require('../../validation/post');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// get all posts
router.get('/', (req, res) => {
	Post.find({})
		.sort({ date: -1 })		// mongoose sort(), -1 for descending
		.then((posts) => res.json(posts))
		.catch((err) => res.status(404).json(err));
});

// get individual post
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then((post) => res.json(post))
		.catch((err) => res.status(404).json(err));
});

// create post
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		userpic: req.body.userpic,
		user: req.user.id
	});

	newPost.save().then((post) => res.json(post));
});

// delete post
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					// check for post owner
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ notauthorized: 'User not authorized to delete this post' });		// 401 for not authorized
					}

					// delete post
					post.remove().then(() => res.json({ success: true }));
				})
				.catch((err) => res.status(404).json({ postnotfound: 'No post found for this post id' }));
		});
});

// like post
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (post.user.toString() === req.user.id) {
						return res.status(401).json({ ownpost: 'User cannot like/unlike own post' });
					}

					if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
						return res.status(400).json({ alreadyliked: 'User already liked this post' });
					}

					// to like this post add user id to likes array
					post.likes.unshift({ user: req.user.id });

					post.save().then((post) => res.json(post));
				})
				.catch((err) => res.status(404).json({ postnotfound: 'No post found for this post id' }));
		});
});

// unlike post
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then((profile) => {
			Post.findById(req.params.id)
				.then((post) => {
					if (post.user.toString() === req.user.id) {
						return res.status(401).json({ ownpost: 'User cannot like/unlike own post' });
					}

					if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
						return res.status(400).json({ haventliked: 'User haven\'t yet liked this post' });
					}

					// get like's index to remove like
					const removeIndex = post.likes
						.map((like) => like.user.toString())
						.indexOf(req.user.id);

					// splice this user's like out of likes array
					post.likes.splice(removeIndex, 1);

					post.save().then((post) => res.json(post));
				})
				.catch((err) => res.status(404).json({ postnotfound: 'No post found for this post id' }));
		});
});

// add comment to post. :id is post id
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);		// cause comment has same fields as post
	if (!isValid) {
		return res.status(400).json(errors);
	}

	Post.findById(req.params.id)
		.then((post) => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				userpic: req.body.userpic,
				user: req.user.id
			};

			// add to comments array
			post.comments.unshift(newComment);

			post.save().then((post) => res.json(post));
		})
		.catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
});

// delete comment from post. :id is post id, :comment_id is comment id
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then((post) => {
			// check if comment exists
			if (post.comments.filter((comment) => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({ commentnotexist: 'This comment was not found' });
			}

			// get comment remove index
			const removeIndex = post.comments
				.map((comment) => comment._id.toString())
				.indexOf(req.params.comment_id);

			// make sure only the comment owner can delete comment
			if (post.comments[removeIndex].user.toString() !== req.user.id) {
				return res.status(401).json({ notauthorized: 'User is not the owner of this comment' });
			}

			post.comments.splice(removeIndex, 1);

			post.save().then((post) => res.json(post));
		})
		.catch((err) => res.status(404).json({ 'post not found': 'post not found' }));
});

module.exports = router;
