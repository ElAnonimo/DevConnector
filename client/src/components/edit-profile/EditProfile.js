import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import ProfileForm from '../common/ProfileForm';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';

class EditProfile extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			profile: {},
			errors: {}
		};

		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.props.getCurrentProfile();
	}

	// onSubmit(evt) {
	onSubmit(profileData) {
		this.props.createProfile(profileData, this.props.history);
	}

	render() {
		return <ProfileForm profile={this.props.profile} errors={this.props.errors} onSubmit={this.onSubmit} />
	}
}

EditProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));
