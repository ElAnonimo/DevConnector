import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// register user
export const registerUser = (userData, history) => (dispatch) => {
	axios.post('/api/users/register', userData)
		// res contains user sent by backend on res.json. user.js, line 46
		.then((res) => {
			console.log('new user registered:', res.data);
			history.push('/login');
		})
		// err contains user validation errors on res.json(errors). user.js, line 18
		.catch((err) => {
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			});
		});
};

// log in - get user token
export const loginUser = (userData) => (dispatch) => {
	axios.post('/api/users/login', userData)
		.then((res) => {
			// save token to localStorage
			const { token } = res.data;
			localStorage.setItem('userJwt', token);			// token is a String no need to token.stringify()
			// set token to browser Authorization header
			setAuthToken(token);
			// decode token to get user data
			const decoded = jwt_decode(token);
			// set current user
			dispatch(setCurrentUser(decoded));
		})
		.catch((err) => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
};

// set logged in user as current
export const setCurrentUser = (decoded) => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
};

// log user out
export const logoutUser = () => (dispatch) => {
	// remove user token from localStorage
	localStorage.removeItem('userJwt');
	// remove browser Authorization header
	setAuthToken(false);
	// set current user to {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
};
