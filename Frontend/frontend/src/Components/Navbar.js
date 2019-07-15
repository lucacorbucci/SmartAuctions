import React from "react";
import PropTypes from "prop-types";

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isActive: false
		};
	}

	toggleNav = () => {
		this.setState(prevState => ({
			isActive: !prevState.isActive
		}));
	};

	render() {
		var i = 0;
		return (
			<div>
				<nav className="navbar" role="navigation" aria-label="main navigation">
					<div className="navbar-brand">
						<a className="navbar-item" href={window.location.origin}>
							<img
								src={require("../Services/Icon/AuctionIcon.png")}
								width="120"
								height="35"
							/>
						</a>
						<a
							role="button"
							className={`button navbar-burger ${
								this.state.isActive ? "is-active" : ""
							}`}
							aria-label="menu"
							aria-expanded="false"
							data-target="navbar"
							onClick={this.toggleNav}
						>
							<span aria-hidden="true" />
							<span aria-hidden="true" />
							<span aria-hidden="true" />
						</a>
					</div>
					<div
						id="navbar"
						className={`navbar-menu ${this.state.isActive ? "is-active" : ""}`}
					>
						<div className="navbar-start">
							{this.props.menuItems.map(item => (
								<a
									className="navbar-item"
									href={window.location.origin + this.props.links[i++]}
								>
									{item}
								</a>
							))}
						</div>
						<div className="navbar-end" />
					</div>
				</nav>
			</div>
		);
	}
}

Navbar.propTypes = {
	menuItems: PropTypes.array.isRequired,
	links: PropTypes.array.isRequired
};
