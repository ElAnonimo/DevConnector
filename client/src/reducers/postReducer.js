import { ADD_POST, GET_POST, GET_POSTS, DELETE_POST, LIKE_POST, POST_LOADING } from '../actions/types';

const initialState = {
	posts: [],
	post: {},
	loading: false
};

export default function(state = initialState, action) {
	switch(action.type) {
		case POST_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_POSTS:
			return {
				...state,
				posts: action.payload,
				loading: false
			};
		case GET_POST:
			return {
				...state,
				post: action.payload,
				loading: false
			};
		case ADD_POST:
			return {
				posts: [action.payload, ...state.posts]
			};
		case DELETE_POST:
			return {
				posts: [...state.posts.filter((post) => post._id !== action.payload.id)]
			};
		case LIKE_POST:
			return {
				...state,
				posts: state.posts.map((post) => {
					if (post._id === action.payload._id) {
						return {
							...post,
							...action.payload
						};
					} else {
						return post;
					}
				})
			};
		default:
			return state;
	}
}
