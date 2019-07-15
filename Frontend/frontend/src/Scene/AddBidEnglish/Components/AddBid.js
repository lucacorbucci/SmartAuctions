import React from "react";
import "bulma/css/bulma.css";
import { ENGLISH_ABI } from "../../../Services/Ethereum/config.js";
import Web3 from "web3";
import Footer from "../../../Components/Footer";
import { css } from "@emotion/core";
import { GridLoader, HashLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

const divAllPage = {
	height: "80vh"
};

function validate(bidAmount) {
	return {
		bidAmount: bidAmount.length === 0 || isNaN(bidAmount) || bidAmount < 0
	};
}

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			myAddress: "",
			contratto: "",
			bidAmount: "",
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			numeroBlocco: 0,
			started: false,
			finalized: false,
			loaded: false,
			bidded: false,
			myOffer: undefined,
			highestBidder: "",
			highestBid: undefined,
			isDirectEnded: false,
			minIncrement: undefined,
			highestBid: undefined,
			buyoutPrice: undefined,
			reservePrice: undefined,
			isEnded: undefined,

			auctionStart: undefined,
			blocchiStart: undefined,
			lastOfferBlock: undefined,
			numBlockLastOffer: undefined,
			title: undefined,
			map: new Map(),
			onTransaction: false,
			mapInput: {
				bidAmount: false
			}
		};

		this.AcquistaDiretto = this.AcquistaDiretto.bind(this);
		this.addBid = this.addBid.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onBlockNumber = this.onBlockNumber.bind(this);
		this.finalize = this.finalize.bind(this);
		this.notify = this.notify.bind(this);
		this.closeModalInfo = this.closeModalInfo.bind(this);

		var blockNumber = 0;
	}

	cancel() {
		this.setState({
			bidAmount: ""
		});
	}

	onUpdate = val => {
		console.log(this.state.lastOfferBlock);
		console.log(this.state.numBlockLastOffer);
		console.log(this.state.numeroBlocco);
		console.log("val" + val);
		if (
			this.state.auctionStart + this.state.blocchiStart <= val &&
			this.state.started == false
		) {
			this.setState({
				numeroBlocco: val,
				started: true
			});
		}
		if (
			this.state.lastOfferBlock != 0 &&
			this.state.lastOfferBlock + this.state.numBlockLastOffer < val
		) {
			this.setState({
				numeroBlocco: val
			});
		}
		this.blockNumber = val;
	};

	onBlockNumber(val) {
		console.log("val" + val);

		this.setState({
			numeroBlocco: val
		});
		this.blockNumber = val;
	}

	notify = (text, func) => {
		const options = {
			autoClose: 6000,
			type: toast.TYPE.SUCCESS,
			position: toast.POSITION.TOP_RIGHT,
			pauseOnHover: true,
			closeButton: true,
			closeOnClick: true,
			onClick: func
		};
		toast(text, options);
	};

	componentDidMount() {
		const contratto = new this.state.web3.eth.Contract(
			ENGLISH_ABI,
			this.props.match.params.contractAddress
		);

		contratto.events
			.HighestBidIncreased()
			.on("data", event => {
				console.log(event.id);
				if (!this.state.map.has(event.id)) {
					console.log("eevento");
					console.log(event);
					if (this.state.myAddress != event.returnValues[0]) {
						this.notify(
							"Nuova Offerta ricevuta, rilancia per non perdere la possibilità di vincere l'asta"
						);
					}

					this.setState({
						highestBidder: event.returnValues[0],
						highestBid: parseInt(event.returnValues[1]._hex)
					});
					this.state.map.set(event.id, true);
				}
			})

			.on("error", console.error);

		contratto.events
			.AuctionEnded()
			.on("data", event => {
				if (!this.state.map.has(event.id)) {
					this.notify("L'asta è terminata ed è stata finalizzata");
					this.setState({
						highestBidder: event.returnValues[0],
						highestBid: parseInt(event.returnValues[1]._hex),
						isEnded: true
					});
					this.state.map.set(event.id, true);
				}
			})

			.on("error", console.error);
	}

	async componentWillMount() {
		const contratto = new this.state.web3.eth.Contract(
			ENGLISH_ABI,
			this.props.match.params.contractAddress
		);
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];

		var that = this;
		contratto.methods
			.getAllData()
			.call({ from: this.state.account })
			.then(function(result) {
				that.setState({
					myAddress: address,
					contratto: contratto,

					minIncrement: parseInt(result[0]._hex),
					highestBid: parseInt(result[1]._hex),
					buyoutPrice: parseInt(result[2]._hex),
					reservePrice: parseInt(result[3]._hex),
					isEnded: result[4],

					auctionStart: parseInt(result[6]),
					blocchiStart: parseInt(result[7]),
					lastOfferBlock: parseInt(result[8]),
					numBlockLastOffer: parseInt(result[9]),

					isDirectEnded: result[5],
					highestBidder: result[10],
					title: result[11]
				});
				contratto.methods
					.getURL()
					.call({ from: that.state.account })
					.then(function(result) {
						console.log(result);
						that.setState({
							url: result,
							loaded: true
						});
					})
					.catch(err => {
						console.log("Failed with error: " + err);
					});
			})
			.catch(err => {
				console.log("Failed with error: " + err);
			});
	}

	async addBid() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({
			onTransaction: true,
			mapInput: {
				bidAmount: false
			}
		});
		this.state.contratto.methods
			.bid()
			.send({
				from: address,
				value: this.state.bidAmount
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				this.cancel();
				this.setState({
					lastOffer: receipt.blockNumber,
					myOffer: this.state.bidAmount,
					isDirectEnded: true,
					onTransaction: false,
					lastOfferBlock: receipt.blockNumber
				});
			})
			.on("error", () => {
				this.setState({
					errore: true,
					onTransaction: false
				});
			});
		this.cancel();
	}

	async AcquistaDiretto() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		console.log(this.state.buyoutPrice);
		this.setState({
			onTransaction: true,
			mapInput: {
				bidAmount: false
			}
		});

		this.state.contratto.methods
			.acquistoDiretto()
			.send({
				from: address,
				value: this.state.buyoutPrice
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log("acquistato direttamente");
				this.setState({
					onTransaction: false,
					isEnded: true
				});
			})
			.on("error", () => {
				this.setState({
					onTransaction: false,
					errore: true
				});
			});
	}

	closeModalInfo() {
		this.setState({
			onTransaction: false
		});
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.state.mapInput[name] = true;
		console.log(this.state.mapInput[name]);

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
				this.cancel();
				this.setState({
					finalized: true,
					isEnded: true
				});
			});
	}

	render() {
		const errors = validate(this.state.bidAmount);
		const isDisabled = Object.keys(errors).some(x => errors[x]);

		return (
			<div className="contentp">
				<div className="app-content" />
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div className="container">
							<h1 className="title is-2">{"Partecipa all'asta"}</h1>
						</div>
					</div>
				</section>
				<br />
				<div style={divAllPage}>
					<div className="container control">
						{this.state.onTransaction ? (
							<div className="modal is-active">
								<div
									className="modal-background"
									onClick={this.closeModalInfo}
								/>
								<div className="modal-card">
									<header className="modal-card-head">
										<p className="modal-card-title">Attendi</p>
										<button className="delete" onClick={this.closeModalInfo} />
									</header>
									<section className="modal-card-body">
										Potrebbero volerci fino a 30 secondi per confermare la
										transazione
										<br />
										<br />
										<div className="HashLoader">
											<HashLoader
												css={override}
												sizeUnit={"px"}
												size={37}
												color={"#36D7B7"}
											/>
										</div>
										<br />
										<br />
									</section>
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
							<div className="columns">
								<div className="column is-one-third">
									<p className="image">
										<img src={this.state.url} />
									</p>
								</div>
								<div className="column">
									<div>
										<h1 className="title is-1">{this.state.title}</h1>
									</div>
									<br />
									<div>
										{this.state.isEnded ? (
											<article className="message is-danger">
												<div className="message-header">
													<p>Avviso!</p>
												</div>
												<div className="message-body">
													L'asta è terminata. Impossibile fare altre offerte
													<br />
												</div>
											</article>
										) : this.state.lastOfferBlock != 0 &&
										  this.state.lastOfferBlock + this.state.numBlockLastOffer <
												this.state.numeroBlocco ? (
											<div>
												<h1 className="title is-4">Completa l'asta</h1>

												<div className="tile is-parent">
													<article className="tile is-child notification is-primary">
														<p className="subtitle">
															{this.state.highestBidder === this.state.myAddress
																? "Sei il vincitore, puoi finalizzare l'asta."
																: "Non è possibile fare altre offerte, se hai creato l'asta puoi terminarla."}
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
										) : this.state.auctionStart + this.state.blocchiStart <=
										  this.state.numeroBlocco ? (
											<div>
												<h1 className="title is-4">Fai un'offerta</h1>
												<div className="tile is-parent">
													<article className="tile is-child notification is-primary">
														<p className="subtitle">
															{this.state.highestBidder === this.state.myAddress
																? "Attualmente sei il vincitore dell'asta"
																: this.state.highestBid > 0
																? "Ehi, ci sono già delle offerte per questo prodotto. Offri almeno " +
																  parseInt(
																		parseInt(
																			this.state.highestBid != undefined
																				? this.state.highestBid
																				: this.state.highestBid
																		) + parseInt(this.state.minIncrement)
																  )
																: "Nessuno ha ancora fatto un'offerta, vuoi essere il primo? Offri almeno " +
																  this.state.reservePrice +
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
															className={
																this.state.mapInput.bidAmount == false
																	? "input"
																	: errors.bidAmount == true
																	? "input is-danger"
																	: "input"
															}
															type="text"
															onChange={this.handleInputChange}
															placeholder={
																this.state.highestBid > 0
																	? parseInt(
																			parseInt(this.state.highestBid) +
																				parseInt(this.state.minIncrement)
																	  )
																	: parseInt(this.state.reservePrice)
															}
															name="bidAmount"
															value={this.state.bidAmount}
														/>
														<p className="control">
															<button
																className="button is-link"
																onClick={this.addBid}
																disabled={isDisabled}
															>
																Invia offerta
															</button>
														</p>
													</div>
												</div>

												<br />
												<br />
												<div>
													<h1 className="title is-4">
														Oppure acquista direttamente
													</h1>
													{!this.state.isDirectEnded ? (
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
				</div>
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}

export default Concluse;
