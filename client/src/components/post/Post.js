import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPost } from '../../actions/postActions';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';

class Post extends Component {
	componentDidMount() {
		// console.log(this.props);
		this.props.getPost(this.props.computedMatch.params.id);
	}

	render() {
		const { post, loading } = this.props.post;

		let postContent;
		if (!post || loading || Object.keys(post).length === 0) {
			postContent = <Spinner />;
		} else {
			postContent = <div>
				<PostItem post={post} showActions={false} />
				<CommentForm postId={post._id} />
				<CommentFeed comments={post.comments} postId={post._id} />
			</div>;
		}

		return (
			<div className="post">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<Link to="/feed" className="btn btn-light mb-3">Go to all posts</Link>
							{postContent}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Post.propTypes = {
	post: PropTypes.object.isRequired,
	getPost: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
