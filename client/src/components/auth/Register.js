import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			errors: {}
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	/* componentDidUpdate(prevProps, prevState) {					// my experimentation. This life cycle wasn't in the course
		if (prevProps.errors !== this.props.errors) {
			console.log('prevProps:', prevProps);
			console.log('prevState:', prevState);
			console.log('this.props.errors:', this.props.errors);
			// this.setState({ errors: this.props.errors });
			console.log('they aren\'t equal');
		}
	} */

	onChange(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}

	onSubmit(evt) {
		evt.preventDefault();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		};

		this.props.registerUser(newUser, this.props.history);

		/* axios.post('/api/users/register', newUser)
			// res is user sent by backend on res.json. user.js, line 46
			.then((res) => console.log(res.data))
			// err is user validation errors on res.json(errors). user.js, line 18
			.catch((err) => this.setState({ errors: err.response.data })); */
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="register">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Sign Up</h1>
							<p className="lead text-center">Create your DevConnector account</p>
							<form onSubmit={this.onSubmit}>
								<TextFieldGroup name="name"
									placeholder="Name"
									value={this.state.name}
									onChange={this.onChange}
									error={errors.name}
								/>
								<TextFieldGroup type="email" name="email"
									placeholder="E-mail Address"
									value={this.state.email}
									onChange={this.onChange}
									error={errors.email}
									info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
								/>
								<TextFieldGroup type="password" name="password"
									placeholder="Password"
									value={this.state.password}
									onChange={this.onChange}
									error={errors.password}
								/>
								<TextFieldGroup type="password" name="password2"
									placeholder="Confirm Password"
									value={this.state.password2}
									onChange={this.onChange}
									error={errors.password2}
								/>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(Register);
