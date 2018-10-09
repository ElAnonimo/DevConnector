import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { addEducation } from '../../actions/profileActions';

class AddEducation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			school: '',
			degree: '',
			'field of study': '',
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

		const eduData = {
			school: this.state.school,
			degree: this.state.degree,
			'field of study': this.state['field of study'],
			from: this.state.from,
			to: this.state.to,
			description: this.state.description,
			current: this.state.current
		};

		this.props.addEducation(eduData, this.props.history);
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
			<div className="add-education">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<Link to="/dashboard" className="btn btn-light">Go to dashboard</Link>
							<h1 className="display-4 text-center">Add education</h1>
							<p className="lead text-center">Add any school, bootcamp, etc that you have attended</p>
							<small className="d-block pb-3">* = required</small>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup
									placeholder="* school"
									name="school"
									value={this.state.school}
									onChange={this.onChange}
									error={errors.school}
								/>
								<TextFieldGroup
									placeholder="* degree or certification"
									name="degree"
									value={this.state.degree}
									onChange={this.onChange}
									error={errors.degree}
								/>
								<TextFieldGroup
									placeholder="* field of study"
									name="field of study"
									value={this.state['field of study']}
									onChange={this.onChange}
									error={errors['field of study']}
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
									<label htmlFor="current" className="form-check-label">Current education</label>
								</div>
								<TextAreaFieldGroup
									placeholder="Program description"
									name="description"
									value={this.state.description}
									onChange={this.onChange}
									error={errors.description}
									info="Tell us about the program that you were in"
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

AddEducation.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	addEducation: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	profile: state.profile,
	errors: state.errors
});

export default connect(mapStateToProps, { addEducation })(withRouter(AddEducation));
