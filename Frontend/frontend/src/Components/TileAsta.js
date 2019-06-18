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
				<div class="tile is-parent">
					<div className="columns is-multiline is-mobile">
						{this.props.auctionData.map(auction => (
							<div className="column is-one-quarter">
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
			</div>
		);
	}
}

TileAsta.propTypes = {
	auctionData: PropTypes.array.isRequired
};
