import React from "react";
import "bulma/css/bulma.css";
import { ENGLISH_ABI } from "../Ethereum/config.js";
import Web3 from "web3";
import Footer from "./Footer";
import { css } from "@emotion/core";
// First way to import
import { GridLoader } from "react-spinners";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			myAddress: "",
			auctionData: {},
			contratto: "",
			bidAmount: 0,
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			numeroBlocco: 0,
			started: false,
			finalized: false,
			lastOffer: 0,
			loaded: false,
			bidded: false,
			myOffer: undefined,
			highestBidder: ""
		};
		this.AcquistaDiretto = this.AcquistaDiretto.bind(this);
		this.addBid = this.addBid.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onBlockNumber = this.onBlockNumber.bind(this);
		this.finalize = this.finalize.bind(this);
		this.addNotification = this.addNotification.bind(this);
		this.notificationDOMRef = React.createRef();
		var blockNumber = 0;
	}

	onUpdate = val => {
		if (
			this.state.auctionData.auctionStart +
				this.state.auctionData.blocchiStart <=
				val &&
			this.state.started == false
		) {
			this.setState({
				numeroBlocco: val,
				started: true
			});
		}
		if (
			this.state.auctionData.lastOfferBlock != 0 &&
			this.state.auctionData.lastOfferBlock +
				this.state.auctionData.numBlockLastOffer <
				val
		) {
			this.setState({
				numeroBlocco: val
			});
		}
		this.blockNumber = val;
	};

	onBlockNumber(val) {
		this.setState({
			numeroBlocco: val,
			loaded: true
		});
		this.blockNumber = val;
	}

	addNotification(title, text) {
		this.notificationDOMRef.current.addNotification({
			title: title,
			message: text,
			type: "info",
			insert: "top",
			container: "top-right",
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			dismiss: { duration: 2000 },
			dismissable: { click: true }
		});
	}

	async componentWillMount() {
		const contratto = new this.state.web3.eth.Contract(
			ENGLISH_ABI,
			this.props.match.params.contractAddress
		);
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];

		contratto.events
			.HighestBidIncreased()
			.on("data", event => {
				this.addNotification(
					"Nuova Offerta ricevuta",
					"Rilancia per non perdere la possibilità di vincere l'asta"
				);
				console.log(this.state.highestBidder);
				this.setState({
					highestBidder: event.returnValues[0]
				});
				console.log(this.state.highestBidder);

				console.log(this.state.highestBidder == this.state.myAddress);

				console.log(this.state.highestBidder === this.state.myAddress);
				console.log(this.state.highestBidder + "" == this.state.myAddress + "");
				console.log(this.state.myAddress);
				console.log(event.returnValues[0]); // same results as the optional callback above
			})

			.on("error", console.error);

		var that = this;
		contratto.methods
			.getAllData()
			.call({ from: this.state.account })
			.then(function(result) {
				that.setState({
					myAddress: address,
					contratto: contratto,
					auctionData: {
						minIncrement: parseInt(result[0]._hex),
						highestBid: parseInt(result[1]._hex),
						buyoutPrice: parseInt(result[2]._hex),
						reservePrice: parseInt(result[3]._hex),
						isEnded: result[4],
						isDirectEnded: result[5],
						auctionStart: parseInt(result[6]),
						blocchiStart: parseInt(result[7]),
						lastOfferBlock: parseInt(result[8]),
						numBlockLastOffer: parseInt(result[9])
					},
					highestBidder: result[10]
				});
			})
			.catch(err => {
				console.log("Failed with error: " + err);
			});
	}

	async addBid() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.state.contratto.methods
			.bid()
			.send({
				from: address,
				value: this.state.bidAmount
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				this.setState({
					lastOffer: receipt.blockNumber,
					myOffer: this.state.bidAmount
				});
			});
	}

	async AcquistaDiretto() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];

		this.state.contratto.methods
			.acquistoDiretto()
			.send({
				from: address,
				value: this.state.auctionData.buyoutPrice
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log("acquistato direttamente");
			});
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		this.setState({
			bidAmount: value
		});
	}

	async finalize() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.state.contratto.methods
			.finalize()
			.send({
				from: address
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				this.setState({
					finalized: true,
					auctionData: {
						isEnded: true
					}
				});
			});
	}

	render() {
		return (
			<div>
				<div className="app-content">
					<ReactNotification ref={this.notificationDOMRef} />
				</div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div className="container">
							<h1 className="title is-2">{"Partecipa all'asta"}</h1>
						</div>
					</div>
				</section>
				<br />
				<div className="container control">
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
						<div className="columns">
							<div className="column is-one-third">
								<p className="image">
									<img src="https://cdn.corrieredellosport.it/images/2019/06/12/172034860-211f05c4-c44c-4c85-9084-d3f0f1a483ca.jpg" />
								</p>
							</div>
							<div className="column">
								<div>
									<h1 className="title is-1">
										{this.props.match.params.Titolo}
									</h1>
								</div>
								<br />
								<div>
									{this.state.auctionData.isEnded ? (
										<article className="message is-danger">
											<div className="message-header">
												<p>Avviso!</p>
											</div>
											<div className="message-body">
												L'asta è terminata. Impossibile fare altre offerte
												<br />
											</div>
										</article>
									) : this.state.auctionData.lastOfferBlock != 0 &&
									  this.state.auctionData.lastOfferBlock +
											this.state.auctionData.numBlockLastOffer <
											this.state.numeroBlocco ? (
										<div>
											<h1 className="title is-4">Completa l'asta</h1>

											<div className="tile is-parent">
												<article className="tile is-child notification is-primary">
													<p className="subtitle">
														Non è possibile fare altre offerte, se sei il
														vincitore e o se hai creato l'asta puoi terminarla.
													</p>
												</article>
											</div>
											<div className="content" />

											<div className="content" />
											<div className="column is-half is-offset-one-quarter">
												<div className="column is-half is-offset-one-quarter">
													<p className="control">
														<a
															className="button is-link"
															onClick={this.finalize}
														>
															Finalizza l'asta
														</a>
													</p>
												</div>
											</div>
										</div>
									) : this.state.auctionData.auctionStart +
											this.state.auctionData.blocchiStart <=
									  this.state.numeroBlocco ? (
										<div>
											<h1 className="title is-4">Fai un'offerta</h1>
											<div className="tile is-parent">
												<article className="tile is-child notification is-primary">
													<p className="subtitle">
														{this.state.highestBidder === this.state.myAddress
															? "Attualmente sei il vincitore dell'asta"
															: this.state.auctionData.highestBid > 0
															? "Ehi, ci sono già delle offerte per questo prodotto. Offri almeno " +
															  parseInt(
																	parseInt(this.state.auctionData.highestBid) +
																		parseInt(
																			this.state.auctionData.minIncrement
																		)
															  )
															: "Nessuno ha ancora fatto un'offerta, vuoi essere il primo? Offri almeno " +
															  this.state.auctionData.reservePrice +
															  " Wei per partecipare all'asta!"}
													</p>
												</article>
											</div>

											<div className="content" />
											<div className="column is-half is-offset-one-quarter">
												<div className="field has-addons">
													<p className="control">
														<p className="button ">Wei</p>
													</p>
													<input
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder={
															this.state.auctionData.highestBid > 0
																? parseInt(
																		parseInt(
																			this.state.auctionData.highestBid
																		) +
																			parseInt(
																				this.state.auctionData.minIncrement
																			)
																  )
																: parseInt(this.state.auctionData.reservePrice)
														}
														name={this.state.bidAmount}
													/>
													<p className="control">
														<a className="button is-link" onClick={this.addBid}>
															Invia offerta
														</a>
													</p>
												</div>
											</div>

											<br />
											<br />
											<div>
												<h1 className="title is-4">
													Oppure acquista direttamente
												</h1>
												{!this.state.auctionData.isDirectEnded ? (
													// se ancora posso fare un acquisto diretto
													<a
														className="button is-link"
														onClick={this.AcquistaDiretto}
													>
														Acquista direttamente
													</a>
												) : (
													// caso in cui devo stampare il blocco rosso
													<article className="message is-danger">
														<div className="message-header">
															<p>Acquisto Diretto</p>
														</div>
														<div className="message-body">
															Per questa asta non è più disponibile l'acquisto
															diretto
														</div>
													</article>
												)}
												<br />
												<br />
												<br />
											</div>
										</div>
									) : (
										<article className="message is-danger">
											<div className="message-header">
												<p>Avviso!</p>
											</div>
											<div className="message-body">
												L'asta inizierà a breve!
												<br />
											</div>
										</article>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}

export default Concluse;
