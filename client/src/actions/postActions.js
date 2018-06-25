import axios from 'axios';
import { ADD_POST, GET_POST, GET_POSTS, DELETE_POST, LIKE_POST, POST_LOADING, GET_ERRORS, CLEAR_ERRORS } from './types';

// add post
export const addPost = (postData) => (dispatch) => {
	dispatch(clearErrors());
	axios.post('/api/posts', postData)
		.then((res) => dispatch({
			type: ADD_POST,
			payload: res.data
		}))
		.catch((err) => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
};

// get all posts
export const getPosts = () => (dispatch) => {
	dispatch(setPostsLoading());
	axios.get('/api/posts')
		.then((res) => dispatch({
			type: GET_POSTS,
			payload: res.data
		}))
		.catch((err) => dispatch({
			// not GET_ERRORS because getPosts() isn't used with a form to send errors to unlike addPosts()
			type: GET_POSTS,
			// couldn't fetch posts, there are none to send, send {}
			payload: {}
		}));
};

// get post
export const getPost = (id) => (dispatch) => {
	dispatch(setPostsLoading());
	axios.get(`/api/posts/${id}`)
		.then((res) => dispatch({
			type: GET_POST,
			payload: res.data
		}))
		.catch((err) => dispatch({
			// not GET_ERRORS because getPost() isn't used with a form to send errors to unlike addPosts()
			type: GET_POST,
			// couldn't fetch posts, there are none to send, send {}
			payload: {}
		}));
};

// delete post
export const deletePost = (id) => (dispatch) => {
	axios.delete(`/api/posts/${id}`)
		.then((res) => dispatch({
			type: DELETE_POST,
			payload: id
		}))
		.catch((err) => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
};

// add like
export const addLike = (id) => (dispatch) => {
	axios.post(`/api/posts/like/${id}`)
		.then(({ data }) => {
			dispatch({
				type: LIKE_POST,
				payload: data 		// pass in updated post
			});
		})
		.catch(({ response }) => {
			dispatch({
				type: GET_ERRORS,
				payload: response.data
			});
		});
};

// remove like
export const removeLike = (id) => (dispatch) => {
	axios.post(`/api/posts/unlike/${id}`)
		.then(({ data }) => {
			dispatch({
				type: LIKE_POST,
				payload: data 		// pass in updated post
			});
		})
		.catch(({ response }) => {
			dispatch({
				type: GET_ERRORS,
				payload: response.data
			});
		});
};

// add comment
export const addComment = (postId, newComment) => (dispatch) => {
	dispatch(clearErrors());
	axios.post(`/api/posts/comment/${postId}`, newComment)
		.then((res) => dispatch({
			type: GET_POST,
			payload: res.data
		}))
		.catch((err) => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
};

// delete comment
export const deleteComment = (postId, commentId) => (dispatch) => {
	axios.delete(`/api/posts/comment/${postId}/${commentId}`)
		.then((res) => dispatch({
			type: GET_POST,
			payload: res.data
		}))
		.catch((err) => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
};

// set posts loading state
export const setPostsLoading = () => {
	return {
		type: POST_LOADING
	};
};

// clear errors on application state
export const clearErrors = () => {
	return {
		type: CLEAR_ERRORS
	};
};
