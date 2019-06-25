import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";
import ParticleComponent from "./Particles";
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

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mounted: false,
			width: "",
			heigth: "",
			auctionData: [],
			auctionDataNonStarted: [],
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			numeroBlocco: 0,
			loaded: false
		};

		var blockNumber = 0;
	}

	onUpdate = val => {
		this.blockNumber = val;
	};

	onBlockNumber = val => {
		this.numeroBlocco = val;
	};

	updateDimensions() {
		var tmp = document.getElementById("cnt");
		this.setState({
			mounted: true,
			width: tmp.offsetWidth,
			heigth: tmp.offsetHeight
		});
	}

	componentWillMount() {
		const storageContract = new this.state.web3.eth.Contract(
			ABI_STORAGE,
			ADDRESS_STORAGE
		);

		var numeroBlocco;
		this.state.web3.eth.getBlockNumber().then(data => {
			numeroBlocco = data;
		});

		var res = {};
		var that = this;
		storageContract.methods
			.getAllContracts()
			.call({ from: this.state.account })
			.then(function(result) {
				console.log(result);
				var mapping = [];
				var mappingNonStarted = [];
				var length = result[0].length;
				console.log(length);
				for (var i = 0; i < length; i++) {
					var tmp = {
						openAuctions_Owner: result[0][i],
						openAuctions_ContractAddress: result[1][i],
						openAuctions_Url: result[2][i],
						openAuctions_Title: result[3][i],
						openAuctions_Type: result[4][i],
						openAuctions_start: parseInt(result[5][i])
					};
					if (parseInt(result[5][i]) <= numeroBlocco) {
						mapping.push(tmp);
					} else {
						mappingNonStarted.push(tmp);
					}
				}
				console.log(mapping);
				console.log(mappingNonStarted);
				that.setState({
					auctionData: mapping,
					auctionDataNonStarted: mappingNonStarted,
					loaded: true
				});
			});
	}

	componentDidMount() {
		var tmp = document.getElementById("cnt");
		this.setState({
			mounted: true,
			width: tmp.offsetWidth,
			heigth: tmp.offsetHeight
		});
		window.addEventListener("resize", this.updateDimensions.bind(this));
		var that = this;
	}

	render() {
		return (
			<div>
				<div className="hero is-medium is-primary is-bold">
					{this.state.mounted ? (
						<ParticleComponent
							heigth={this.state.heigth}
							width={this.state.width}
						/>
					) : (
						<div />
					)}
					<div id="cnt" className="hero-body">
						<div className="container">
							<div margin="0">
								<h1 className="title is-1">Benvenuto!</h1>
							</div>

							<h1 className="title is-2">Crea subito una nuova asta</h1>

							<br />

							<div className="field is-grouped">
								<p className="control">
									<a
										className="button is-medium is-hovered is-link is-rounded"
										href={"/addAstaInglese"}
									>
										Asta Inglese
									</a>
								</p>
								<p className="control">
									<a
										className="button is-medium is-link is-hovered is-rounded"
										href="addAstaVickrey"
									>
										Asta Vickrey
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
				<br />
				
				{this.state.loaded == false ? (
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

					<div>
						{this.state.auctionData.length != 0 ? <div>
					<div style={{ textAlign: "center" }}>
						<h1 className="title is-2">Aste in corso</h1>
					</div>
				</div> : <div/>}
					
					<div style={{ margin: 10 }}>
						<TileAsta auctionData={this.state.auctionData} />
					</div>
					</div>

				)}
				{this.state.auctionDataNonStarted.length != 0 ? (
					<div>
						<div style={{ textAlign: "center" }}>
							<h1 className="title is-2">Aste che inizieranno a breve</h1>
						</div>
					</div>
				) : (
					<div />
				)}

				{this.state.loaded == false ? (
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
						<TileAsta auctionData={this.state.auctionDataNonStarted} />
					</div>
				)}

				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}
export default Home;
