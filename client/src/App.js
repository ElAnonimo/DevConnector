import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { logoutUser, setCurrentUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute.js';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/NotFound/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

import './App.css';

// check for current user token
if (localStorage.userJwt) {
	// set browser Authorization header
	setAuthToken(localStorage.userJwt);
	// decode token to get user data and expiration time (iat)
	const decoded = jwt_decode(localStorage.userJwt);
	// set current user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	// check if token expired
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {						// exp prop on token. Its expiration time
		store.dispatch(clearCurrentProfile());
		store.dispatch(logoutUser());							// log user out
		window.location.href = '/login';					// redirect to /login
	}
}

class App extends Component {
  render() {
    return (
    	<Provider store={store}>
				<BrowserRouter>
					<div className='App'>
						<Navbar />
						<Route exact path='/' component={Landing} />
						<div className='container'>
							<Route exact path='/register' component={Register} />
							<Route exact path='/login' component={Login} />
							<Switch>
								<PrivateRoute exact path='/dashboard' component={Dashboard} />
								<PrivateRoute exact path='/create-profile' component={CreateProfile} />
								<PrivateRoute exact path='/edit-profile' component={EditProfile} />
								<PrivateRoute exact path='/add-experience' component={AddExperience} />
								<PrivateRoute exact path='/add-education' component={AddEducation} />
								<PrivateRoute exact path='/feed' component={Posts} />
								<PrivateRoute exact path='/post/:id' component={Post} />
							</Switch>
							<Route path='/profiles' component={Profiles} />
							<Route path='/profile/:handle' component={Profile} />   {/* see line 24 in Profile.js */}
							<Route exact path='/notfound' component={NotFound} />
						</div>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
    );
  }
}

export default App;
