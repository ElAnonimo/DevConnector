import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addExperience } from '../../actions/profileActions';

class AddExperience extends Component {
	constructor(props) {
		super(props);
		this.state = {
			company: '',
			title: '',
			location: '',
			from: '',
			to: '',
			current: false,
			description: '',
			disabled: false,
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onCheck = this.onCheck.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onSubmit(evt) {
		evt.preventDefault();

		const expData = {
			company: this.state.company,
			title: this.state.title,
			location: this.state.location,
			from: this.state.from,
			to: this.state.to,
			description: this.state.description,
			current: this.state.current
		};

		this.props.addExperience(expData, this.props.history);
	}

	onChange(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	onCheck(evt) {
		this.setState({
			disabled: !this.state.disabled,
			current: !this.state.current
		});
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="add-experience">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">Go to dashboard</Link>
							<h1 className="display-4 text-center">Add experience</h1>
							<p className="lead text-center">Add any job or position that you have had in the past or current</p>
							<small className="d-block pb-3">* = required</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* company"
									name="company"
									value={this.state.company}
									onChange={this.onChange}
									error={errors.company}
								/>
								<TextFieldGroup
									placeholder="* job title"
									name="title"
									value={this.state.title}
									onChange={this.onChange}
									error={errors.title}
								/>
								<TextFieldGroup
									placeholder="location"
									name="location"
									value={this.state.location}
									onChange={this.onChange}
									error={errors.location}
								/>
								<h6>From date</h6>
								<TextFieldGroup
									name="from"
									type="date"
									value={this.state.from}
									onChange={this.onChange}
									error={errors.from}
								/>
								<h6>To date</h6>
								<TextFieldGroup
									name="to"
									type="date"
									value={this.state.to}
									onChange={this.onChange}
									error={errors.to}
									disabled={this.state.disabled ? 'disabled' : ''}
								/>
								<div className="form-check mb-4">
									<input type="checkbox" name="current" id='current' className="form-check-input"
										value={this.state.current}
										checked={this.state.current}
										onChange={this.onCheck}
									/>
									<label htmlFor="current" className="form-check-label">Current job</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Job description"
									name="description"
									value={this.state.description}
									onChange={this.onChange}
									error={errors.description}
									info="Tell us about the position"
								/>
								<input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

AddExperience.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	addExperience: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));
