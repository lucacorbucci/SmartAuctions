import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";
import Web3 from "web3";
import { ABI_STORAGE, ADDRESS_STORAGE } from "../Ethereum/config.js";
import Footer from "./Footer";
import { css } from "@emotion/core";
import { GridLoader } from "react-spinners";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

class LeMieAste extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			auctionData: [],
			myAccount: undefined,
			auctionDataEnded: [],
			loadedInCorso: false,
			loadedEnded: false
		};
	}

	onUpdate = val => {};
	onBlockNumber = val => {};

	async componentWillMount() {
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

		const accounts = await web3.eth.getAccounts();
		const address = accounts[0];

		const storageContract = new web3.eth.Contract(ABI_STORAGE, ADDRESS_STORAGE);
		var that = this;
		storageContract.methods
			.getAllContracts()
			.call({ from: this.state.account })
			.then(function(result) {
				var mapping = [];
				var length = result[0].length;
				console.log(length);
				console.log(result);
				for (var i = 0; i < length; i++) {
					if (address == result[0][i]) {
						var tmp = {
							openAuctions_Owner: result[0][i],
							openAuctions_ContractAddress: result[1][i],
							openAuctions_Url: result[2][i],
							openAuctions_Title: result[3][i],
							openAuctions_Type: result[4][i]
						};
						mapping.push(tmp);
					}
				}
				console.log(mapping);
				that.setState({
					auctionData: mapping,
					loadedInCorso: true
				});
			});

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
					auctionDataEnded: mapping,
					loadedEnded: true
				});
			});
	}

	render() {
		return (
			<div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div class="container">
							<h1 className="title is-2">Le mie aste</h1>
						</div>
					</div>
				</section>
				<br />
				<div style={{ textAlign: "center" }}>
					<h1 className="title is-2">Aste in corso</h1>
				</div>
				{this.state.loadedInCorso == false ? (
					<div className="columns">
						<div className="column is-one-half">
							<div className="GridLoader">
								<GridLoader
									css={override}
									sizeUnit={"px"}
									size={50}
									color={"#36D7B7"}
								/>
							</div>
							<br />
							<br />
							<br />
							<br />
							<br />
							<br />
						</div>
					</div>
				) : (
					<div style={{ margin: 10 }}>
						<TileAsta auctionData={this.state.auctionData} />
					</div>
				)}

				{this.state.loadedEnded == false ? (
					<div className="columns">
						<div className="column is-one-half">
							<div className="GridLoader">
								<GridLoader
									css={override}
									sizeUnit={"px"}
									size={50}
									color={"#36D7B7"}
								/>
							</div>
							<br />
							<br />
							<br />
							<br />
							<br />
							<br />
						</div>
					</div>
				) : (
					<div style={{ textAlign: "center" }}>
						<h1 className="title is-2">Aste terminate</h1>
					</div>
				)}
				<div style={{ margin: 10 }}>
					<TileAsta auctionData={this.state.auctionDataEnded} />
				</div>
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}

export default LeMieAste;
