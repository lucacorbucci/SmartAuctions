import React from "react";
import PropTypes from "prop-types";

export default class TileAsta extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false
		};
	}

	render() {
		return (
			<div>
				<div className="columns is-multiline is-centered-mobile">
					{this.props.auctionData.map(auction => (
						<div className="column equal-height is-10-mobile is-offset-1-mobile is-half-tablet is-one-third-desktop is-one-quarter-widescreen">
							<div
								onClick={e => {
									if (this.props.clickable == false) {
									} else {
										if (auction.openAuctions_Type == 0) {
											window.open(
												"/addBid/" +
													auction.openAuctions_ContractAddress +
													"/" +
													auction.openAuctions_Title,
												"_self"
											);
										} else {
											window.open(
												"/addBidVickrey/" +
													auction.openAuctions_ContractAddress +
													"/" +
													auction.openAuctions_Title,
												"_self"
											);
										}
									}
								}}
							>
								<article className="tile is-child notification is-info">
									<p className="title">{auction.openAuctions_Title}</p>
									{auction.openAuctions_Type == 0 ? (
										<p className="subtitle">Asta inglese 🏴󠁧󠁢󠁥󠁮󠁧󠁿</p>
									) : (
										<p className="subtitle">Asta Vickrey ✅</p>
									)}
									<figure className="image is-4by3">
										<img src={auction.openAuctions_Url} />
									</figure>
								</article>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}

TileAsta.propTypes = {
	auctionData: PropTypes.array.isRequired,
	clickable: PropTypes.bool
};
