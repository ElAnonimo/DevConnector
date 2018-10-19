const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const keys = require('./config/keys');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(keys.mongoURI)
	.then(() => console.log('MongoDB connected.'))
	.catch((error) => console.log('MongoDB connection error:', error));

// use passport middleware
app.use(passport.initialize());

// set passport to use passport-jwt strategy
require('./config/passport')(passport);

// use these routes when in development. In production there are no routes only the built app in client/build
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// serve static assets when in production
if (process.env.NODE_ENV === 'production') {
	// set static folder
	app.use(express.static('client/build'));
	// in production there are no routes only the built app in client/build. So all URL requests are responded as below
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log('DevConnector server is running on port', port));
