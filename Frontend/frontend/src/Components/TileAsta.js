import React, { Component } from "react";
import PropTypes from "prop-types";

export default class TileAsta extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div className="columns is-multiline is-centered-mobile">
					{this.props.auctionData.map(auction => (
						<div className="column equal-height is-10-mobile is-offset-1-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
							<article className="tile is-child notification is-info">
								<p className="title">{auction.Title}</p>
								<p className="subtitle">{auction.Url}</p>
								<figure className="image is-4by3">
									<img src="https://bulma.io/images/placeholders/640x480.png" />
								</figure>
							</article>
						</div>
					))}
				</div>
			</div>
		);
	}
}

TileAsta.propTypes = {
	auctionData: PropTypes.array.isRequired
};
