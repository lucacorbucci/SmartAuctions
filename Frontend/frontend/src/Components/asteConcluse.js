import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";
import Web3 from "web3";
import { ABI_STORAGE, ADDRESS_STORAGE } from "../Ethereum/config.js";

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auctionData: []
		};
	}

	componentWillMount() {
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

		const storageContract = new web3.eth.Contract(ABI_STORAGE, ADDRESS_STORAGE);
		var that = this;
		storageContract.methods
			.getEndedAuctions()
			.call({ from: this.state.account })
			.then(function(result) {
				var mapping = [];
				var length = result[0].length;
				console.log(length);
				for (var i = 0; i < length; i++) {
					var tmp = {
						openAuctions_Owner: result[0][i],
						openAuctions_Title: result[1][i],
						openAuctions_Url: result[2][i],
						openAuctions_Type: result[3][i]
					};
					mapping.push(tmp);
				}
				console.log(mapping);
				that.setState({
					auctionData: mapping
				});
			});
	}

	render() {
		return (
			<div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div class="container">
							<h1 className="title is-2">Aste concluse</h1>
							<nav className="level">
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Aste concluse</p>
										<p className="title">3,456</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Aste in corso</p>
										<p className="title">123</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Prodotti venduti</p>
										<p className="title">456K</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Offerte</p>
										<p className="title">789</p>
									</div>
								</div>
							</nav>
						</div>
					</div>
				</section>
				<br />
				<div style={{ margin: 10 }}>
					<TileAsta auctionData={this.state.auctionData} />
				</div>
			</div>
		);
	}
}

export default Concluse;
