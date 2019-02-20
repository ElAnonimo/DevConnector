import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';
import TextFieldGroup from './TextFieldGroup';
import InputGroup from './InputGroup';
import SelectListGroup from './SelectListGroup';
import TextAreaFieldGroup from './TextAreaFieldGroup';

class ProfileForm extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			displaySocialInputs: false,
			handle: '',
			company: '',
			website: '',
			location: '',
			status: '',
			skills: '',
			githubusername: '',
			bio: '',
			twitter: '',
			facebook: '',
			linkedin: '',
			youtube: '',
			instagram: '',
			errors: {}
		};
		
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	
	/* componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
		
		if (nextProps.profile.profile) {
			const profile = nextProps.profile.profile;

			// bring skills array back to csv
			const skillsCsv = profile.skills.join(',');

			// if profile field wasn't provided set it to an empty string
			profile.company = !isEmpty(profile.company) ? profile.company : '';
			profile.website = !isEmpty(profile.website) ? profile.website : '';
			profile.location = !isEmpty(profile.location) ? profile.location : '';
			profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
			profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
			profile.social = !isEmpty(profile.social) ? profile.social : {};
			profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
			profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
			profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
			profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
			profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

			// set component state
			this.setState({
				handle: profile.handle,
				company: profile.company,
				website: profile.website,
				location: profile.location,
				status: profile.status,
				skills: skillsCsv,
				githubusername: profile.githubusername,
				bio: profile.bio,
				twitter: profile.twitter,
				facebook: profile.facebook,
				linkedin: profile.linkedin,
				youtube: profile.youtube,
				instagram: profile.instagram
			});
		}
	} */
	
	static getDerivedStateFromProps(nextProps) {
		let errors = {};
		let profileData = {};
		
		if (nextProps.errors) {
			errors = nextProps.errors;
		} else if (Object.keys(nextProps.errors).length === 0) {
			errors = {};
		}

		if (nextProps.profile.profile) {
			const profile = nextProps.profile.profile;

			// bring skills array back to csv
			const skillsCsv = profile.skills.join(',');

			// if a profile field wasn't provided set it to an empty string
			profile.company = !isEmpty(profile.company) ? profile.company : '';
			profile.website = !isEmpty(profile.website) ? profile.website : '';
			profile.location = !isEmpty(profile.location) ? profile.location : '';
			profile.githubusername = !isEmpty(profile.githubusername) ? profile.githubusername : '';
			profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
			profile.social = !isEmpty(profile.social) ? profile.social : {};
			profile.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
			profile.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
			profile.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
			profile.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
			profile.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

			// set component state
			profileData = {
				handle: profile.handle,
				company: profile.company,
				website: profile.website,
				location: profile.location,
				status: profile.status,
				skills: skillsCsv,
				githubusername: profile.githubusername,
				bio: profile.bio,
				twitter: profile.twitter,
				facebook: profile.facebook,
				linkedin: profile.linkedin,
				youtube: profile.youtube,
				instagram: profile.instagram
			};
		}
		
		return {
			...errors,
			...profileData
		};
  }
	
	onChange(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}
	
	onSubmit(evt) {
		evt.preventDefault();
		
		const profileData = {
			handle: this.state.handle,
			company: this.state.company,
			website: this.state.website,
			location: this.state.location,
			status: this.state.status,
			skills: this.state.skills,
			githubusername: this.state.githubusername,
			bio: this.state.bio,
			twitter: this.state.twitter,
			facebook: this.state.facebook,
			linkedin: this.state.linkedin,
			youtube: this.state.youtube,
			instagram: this.state.instagram
		}
		
		this.props.onSubmit(profileData);
	}
	
	render() {
		const { errors, displaySocialInputs } = this.state;
		
		let socialInputs;
		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputGroup
						placeholder="Twitter profile URL"
						name="twitter"
						icon="fab fa-twitter"
						value={this.state.twitter}
						onChange={this.onChange}
						error={errors.twitter}
					/>
					<InputGroup
						placeholder="Facebook profile URL"
						name="facebook"
						icon="fab fa-facebook"
						value={this.state.facebook}
						onChange={this.onChange}
						error={errors.facebook}
					/>
					<InputGroup
						placeholder="LinkedIn profile URL"
						name="linkedin"
						icon="fab fa-linkedin"
						value={this.state.linkedin}
						onChange={this.onChange}
						error={errors.linkedin}
					/>
					<InputGroup
						placeholder="YouTube channel URL"
						name="youtube"
						icon="fab fa-youtube"
						value={this.state.youtube}
						onChange={this.onChange}
						error={errors.youtube}
					/>
					<InputGroup
						placeholder="Instagram page URL"
						name="instagram"
						icon="fab fa-instagram"
						value={this.state.instagram}
						onChange={this.onChange}
						error={errors.instagram}
					/>
				</div>
			)
		}
		
		// select options for status
		const options = [
			{ label: '* Select professional status', value: '', disabled: 'disabled'},
			{ label: 'developer', value: 'developer' },
			{ label: 'senior developer', value: 'senior developer' },
			{ label: 'manager', value: 'manager' },
			{ label: 'student or learning', value: 'student or learning' },
			{ label: 'instructor or teacher', value: 'instructor or teacher' },
			{ label: 'intern', value: 'intern' },
			{ label: 'other', value: 'other' }
		];
		
		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							{this.state.handle && <Link to="/dashboard" className="btn btn-light">Go to dashboard</Link>}
							<h1 className="display-4 text-center">Edit your profile</h1>
							{!this.state.handle && <p className="lead text-center">Lets get some information to make your profile stand out</p>}
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* Profile Handle"
									name="handle"
									value={this.state.handle}
									onChange={this.onChange}
									error={errors.handle}
									info="A unique handle for your profile URL. Your full name, company name, nickname, etc."
								/>
								<SelectListGroup
									placeholder="Status"
									name="status"
									value={this.state.status}
									onChange={this.onChange}
									options={options}
									error={errors.status}
									info="Give us an idea where you are at in your career"
								/>
								<TextFieldGroup
									placeholder="Company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
									info="Could be your own company or one you work for"
								/>
								<TextFieldGroup
									placeholder="Website"
									name="website"
									value={this.state.website}
									onChange={this.onChange}
									error={errors.website}
									info="Could be your own website or a company one"
								/>
								<TextFieldGroup
									placeholder="Location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
									info="City or city & state suggested (e.g. Boston, MA)"
								/>
								<TextFieldGroup
									placeholder="Skills"
									name="skills"
									value={this.state.skills}
									onChange={this.onChange}
									error={errors.skills}
									info="Please use comma separated values (e.g. HTML, CSS, JS, PHP)"
								/>
								<TextFieldGroup
									placeholder="Github username"
									name="githubusername"
									value={this.state.githubusername}
									onChange={this.onChange}
									error={errors.githubusername}
									info="If you want your latest repos and a Github link, include your username"
								/>
								<TextAreaFieldGroup
									placeholder="Short bio"
									name="bio"
									value={this.state.bio}
									onChange={this.onChange}
									error={errors.bio}
									info="Tell us a little about yourself"
								/>
								<div className="mb-3">
									<button type="button"
										onClick={() => this.setState((prevState) => ({ displaySocialInputs: !prevState.displaySocialInputs }))}
										className="btn btn-light">Add social network links
									</button>
									<span className="text-muted">Optional</span>
								</div>
								{socialInputs}
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

ProfileForm.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

export default ProfileForm;
