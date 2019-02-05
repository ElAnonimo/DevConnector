import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ProfileForm from '../common/ProfileForm';
import { createProfile } from '../../actions/profileActions';
import { withRouter } from 'react-router-dom';

class CreateProfile extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			errors: {}
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onSubmit(profileData) {
		this.props.createProfile(profileData, this.props.history);
	}

	render() {
		return <ProfileForm errors={this.props.errors} onSubmit={this.onSubmit} />
	}
}

CreateProfile.propTypes = {
	errors: PropTypes.object.isRequired,
	createProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	errors: state.errors
});

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile));
