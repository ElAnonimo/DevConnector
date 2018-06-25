import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class ProfileGithub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clientId: process.env.REACT_APP_CLIENT_ID,
			clientSecret: process.env.REACT_APP_CLIENT_SECRET,
			reposCount: 5,
			sort: 'created: asc',
			repos: []
		};
	}

	componentDidMount() {
		const { username } = this.props;
		const { reposCount, sort, clientId, clientSecret } = this.state;

		fetch(`https://api.github.com/users/${username}/repos?per_page=${reposCount}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
			.then((res) => res.json())		// turn res to a json
			.then((data) => {							// data is actual response data. It's res.json() I assume
				if (data.message) alert(`Github request error: ${data.message}`);
				if (this.refs.profileGithubRef) {
					this.setState({ repos: data });
				}
			})
			.catch((err) => console.log('Github API error:', err));
	}

	render() {
		const { repos } = this.state;

		const repoItems = repos.map((repo) => (
			<div key={repo.id} className="card card-body mb-2">
				<div className="row">
					<div className="col-md-6">
						<h4><Link to={repo.html_url} className="text-info" target="_blank">{repo.name}</Link></h4>
						<p>{repo.description}</p>
					</div>
					<div className="col-md-6">
						<span className="badge badge-info mr-1">Stars: {repo.stargazers_count}</span>
						<span className="badge badge-secondary mr-1">Watchers: {repo.watchers_count}</span>
						<span className="badge badge-success">Forks: {repo.forks_count}</span>
					</div>
				</div>
			</div>
		));

		return (
			<div ref="profileGithubRef">
				<hr />
				<h3 className="mb-4">Latest Github Repos</h3>
				{repoItems}
			</div>
		)
	}
}

ProfileGithub.propTypes = {
	username: PropTypes.string.isRequired
};

export default ProfileGithub;
