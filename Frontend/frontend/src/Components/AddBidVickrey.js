import React from "react";
import "bulma/css/bulma.css";
import {
	VICKREY_ABI,
	ABI_STORAGE,
	ADDRESS_STORAGE
} from "../Ethereum/config.js";
import Web3 from "web3";
import abi from "ethereumjs-abi";
import Footer from "./Footer";
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

function validate(
	bidAmountBid,
	NonceBid,
	NonceOpen,
	HashRitiro,
	BidAmountOpen
) {
	return {
		bidAmountBid:
			bidAmountBid.length === 0 || isNaN(bidAmountBid) || bidAmountBid < 0,
		NonceBid: NonceBid.length === 0,
		NonceOpen: NonceOpen.length === 0,
		HashRitiro: HashRitiro.length === 0,
		BidAmountOpen: BidAmountOpen.length === 0 || isNaN(BidAmountOpen)
	};
}

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			auctionData: {},
			contratto: "",
			bidAmount: "",
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			blockNumber: "",
			Phase: -1,
			bidAmountBid: "",
			Hash: "",
			Value: 0,
			NonceBid: "",
			bidded: false,
			HashRitiro: "",
			ritirato: false,
			NonceOpen: "",
			BidAmountOpen: "",
			aperta: 0,
			finalized: false,
			auctionData: {},
			numeroBlocco: undefined,
			started: false,
			withdrawal: false,
			opening: false,
			myAccount: "",
			highestBidder: "",
			loaded: false,
			title: undefined,
			map: new Map(),
			errore: false,
			mapInput: {
				bidAmountBid: false,
				NonceBid: false,
				NonceOpen: false,
				HashRitiro: false,
				BidAmountOpen: false
			},
			url: ""
		};

		var blockNumber = undefined;

		this.addBid = this.addBid.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.generateHash = this.generateHash.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeModalInfo = this.closeModalInfo.bind(this);
		this.ritiraBid = this.ritiraBid.bind(this);
		this.openBid = this.openBid.bind(this);
		this.checkBlock = this.checkBlock.bind(this);
		this.finalize = this.finalize.bind(this);
		this.onBlockNumber = this.onBlockNumber.bind(this);
		this.notify = this.notify.bind(this);
	}

	onUpdate = val => {
		// primo caso in cui facciamo partire l'asta
		if (
			this.state.auctionData.bidPhaseStart <= val &&
			this.state.started == false
		) {
			this.setState({
				numeroBlocco: val,
				started: true
			});
		}

		// secondo caso, si passa alla fase di ritiro offerta
		if (
			this.state.auctionData.withDrawalPhaseStart <= val &&
			val <
				this.state.auctionData.withDrawalPhaseStart +
					this.state.auctionData.bidWithdrawalTime &&
			this.state.withdrawal == false
		) {
			this.setState({
				numeroBlocco: val,
				withdrawal: true
			});
		}

		if (
			this.state.auctionData.bidOpeningPhaseStart <= val &&
			val <
				this.state.auctionData.bidOpeningPhaseStart +
					this.state.auctionData.bidOpeningTime &&
			this.state.opening == false
		) {
			this.setState({
				numeroBlocco: val,
				opening: true
			});
		}
		if (
			this.state.auctionData.bidOpeningPhaseStart +
				this.state.auctionData.bidOpeningTime <=
			val
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
		console.log("val" + this.blockNumber);
		console.log("valssta" + this.state.numeroBlocco);
	}

	generateHash() {
		var hash = this.state.web3.utils.keccak256(
			this.state.web3.eth.abi.encodeParameters(
				["bytes32", "uint256"],
				[
					this.state.web3.utils.asciiToHex(this.state.NonceBid, 32),
					this.state.bidAmountBid + ""
				]
			)
		);
		console.log(
			this.state.web3.eth.abi.encodeParameters(
				["bytes32", "uint256"],
				[
					this.state.web3.utils.asciiToHex(this.state.NonceBid, 32),
					this.state.bidAmountBid + ""
				]
			)
		);
		return hash;
	}

	setPhase(data) {
		var bidStart = this.state.auctionData.bidTimeStart;
		var bidEnd =
			this.state.auctionData.bidTimeStart + this.state.auctionData.bidTime;
		var withDrawalEnd =
			this.state.auctionData.bidTimeStart +
			this.state.auctionData.bidTime +
			this.state.auctionData.bidWithdrawalTime;
		var openEnd =
			this.state.auctionData.bidTimeStart +
			this.state.auctionData.bidTime +
			this.state.auctionData.bidWithdrawalTime +
			this.state.auctionData.bidOpeningTime;
		if (bidStart <= data && data <= bidEnd) {
			this.setState({
				Phase: 0
			});
		} else if (bidEnd < data && data <= withDrawalEnd) {
			this.setState({
				Phase: 1
			});
		} else if (withDrawalEnd < data && data <= openEnd) {
			this.setState({
				Phase: 2
			});
		} else {
			this.setState({
				Phase: 4
			});
		}
	}

	checkBlock() {
		this.state.web3.eth.getBlockNumber().then(data => {
			//console.log(data);
			//console.log(that.state.Phase);
			//console.log(parseInt(data));
			this.setPhase(data);
		});
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

	async componentDidMount() {
		const contratto = new this.state.web3.eth.Contract(
			VICKREY_ABI,
			this.props.match.params.contractAddress
		);

		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];

		contratto.events
			.HighestBidIncreased()
			.on("data", event => {
				console.log(event.id);
				if (!this.state.map.has(event.id)) {
					console.log("eevento");
					console.log(event);
					if (this.state.myAddress != event.returnValues[0]) {
						this.notify("Ricevuta una nuova offerta");
					}

					this.setState({
						highestBidder: event.returnValues[0]
					});
					this.state.map.set(event.id, true);
				}
			})

			.on("error", console.error);

		var that = this;
		contratto.methods
			.getAllData()
			.call({ from: this.state.account })
			.then(function(result) {
				console.log(result);
				that.setState({
					myAddress: address,
					contratto: contratto,
					auctionData: {
						highestBid: parseInt(result[0]._hex),

						// quando iniziano le varie fasi
						bidPhaseStart: parseInt(result[2]._hex),
						withDrawalPhaseStart: parseInt(result[3]._hex),
						bidOpeningPhaseStart: parseInt(result[4]._hex),

						// quanto durano le varie fasi
						bidTime: parseInt(result[5]._hex),
						bidWithdrawalTime: parseInt(result[6]._hex),
						bidOpeningTime: parseInt(result[7]._hex),
						bidDeposit: parseInt(result[8]._hex),

						reservePrice: parseInt(result[9]._hex),
						isEnded: result[10],
						auctioneer: result[13]
					},
					highestBidder: result[12],
					myAccount: address,
					title: result[1]
				});
				console.log(that.state.title);
				console.log(that.state.loaded);
				console.log("ciao");
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
				that.checkBlock();
			});

		var accountInterval = setInterval(async function() {
			const accounts = await that.state.web3.eth.getAccounts();
			const address = accounts[0];

			if (address !== that.state.myAccount) {
				that.setState({
					myAccount: address
				});
			}
		}, 1000);

		const subscription = this.state.web3.eth.subscribe("newBlockHeaders");

		subscription.on("data", async (block, error) => {
			console.log(block.number);
			this.checkBlock(block.number);
		});
	}

	async addBid() {
		var hash = this.generateHash();
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({
			onTransaction: true,
			mapInput: {
				bidAmountBid: false,
				NonceBid: false,
				NonceOpen: false,
				HashRitiro: false,
				BidAmountOpen: false
			}
		});
		this.state.contratto.methods
			.addBid(hash)
			.send({
				from: address,
				value: this.state.auctionData.bidDeposit
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				if (!this.state.map.has(receipt.blockHash)) {
					this.setState({
						onTransaction: false,
						bidded: true,

						Hash: hash,
						NonceBid: "",
						bidAmountBid: ""
					});
					this.state.map.set(receipt.blockHash, true);
				}
			})
			.on("error", () => {
				this.setState({
					errore: true,
					onTransaction: false
				});
			});
	}

	async ritiraBid() {
		this.setState({
			onTransaction: true
		});
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		console.log(this.state.HashRitiro);
		this.state.contratto.methods
			.withdrawal(this.state.HashRitiro)
			.send({
				from: address
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				this.setState({
					mapInput: {
						bidAmountBid: false,
						NonceBid: false,
						NonceOpen: false,
						HashRitiro: false,
						BidAmountOpen: false
					},
					HashRitiro: "",
					onTransaction: false,
					ritirato: true
				});
			});
	}

	async finalize() {
		this.setState({
			onTransaction: true
		});
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.state.contratto.methods
			.finalize()
			.send({
				from: address
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				console.log("conferma finalize");
				this.setState({
					onTransaction: false,
					
					auctionData: {
						isEnded: true,
						mapInput: {
							bidAmountBid: false,
							NonceBid: false,
							NonceOpen: false,
							HashRitiro: false,
							BidAmountOpen: false
						}
					}
				});
				this.setState({
					finalized: true
				});
			});
	}

	async openBid() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({
			onTransaction: true
		});
		var Nonce = this.state.web3.utils.asciiToHex(this.state.NonceOpen, 32);
		console.log(Nonce);
		console.log(address);
		console.log(this.state.BidAmountOpen);
		console.log(this.state.onTransaction);

		this.state.contratto.methods
			.openBid(Nonce)
			.send({
				value: this.state.BidAmountOpen,
				from: address
			})
			.on("error", error => {
				console.log(error);
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				this.setState({
					onTransaction: false,
					NonceOpen: "",
					BidAmountOpen: "",
					aperta: true
				});
				console.log(this.state.onTransaction);
				console.log(this.state.aperta);
			});
	}

	closeModal() {
		this.setState({
			bidded: false,
			ritirato: false,
			finalized: false,
			onTransaction: false
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
		console.log(name);
		console.log(value);
		this.state.mapInput[name] = true;

		this.setState({
			[name]: value
		});
	}

	render() {
		const errors = validate(
			this.state.bidAmountBid,
			this.state.NonceBid,
			this.state.NonceOpen,
			this.state.HashRitiro,
			this.state.BidAmountOpen
		);
		const isDisabled = Object.keys(errors).some(x => errors[x]);

		return (
			<div>
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
										{this.state.auctionData.isEnded ? (
											<article className="message is-danger">
												<div className="message-header">
													<p>Avviso!</p>
												</div>
												<div className="message-body">
													L'asta è terminata. Impossibile fare altre offerte
													<br />
													{this.state.highestBidder == this.state.myAddress
														? "Hai vinto"
														: "Hai perso"}
												</div>
											</article>
										) : this.state.auctionData.bidPhaseStart <=
										  this.state.numeroBlocco ? (
											this.state.numeroBlocco <
											this.state.auctionData.withDrawalPhaseStart ? (
												<div>
													{this.state.bidded ? (
														<div className="modal is-active">
															<div
																className="modal-background"
																onClick={this.closeModal}
															/>
															<div className="modal-card">
																<header className="modal-card-head">
																	<p className="modal-card-title">
																		Offerta inviata con successo
																	</p>
																	<button
																		className="delete"
																		onClick={this.closeModal}
																	/>
																</header>
																<section className="modal-card-body">
																	<div className="content">
																		<b>L'hash della tua offerta:</b>{" "}
																		{this.state.Hash}
																	</div>
																</section>
															</div>
														</div>
													) : (
														<div />
													)}
													<h1 className="title is-4">Fai un'offerta</h1>
													<div class="tile is-parent">
														<article class="tile is-child notification is-primary">
															<p class="subtitle">
																Inserisci l'importo che vuoi scommettere e una
																parola segreta, l'offerta che verrà inviata sarà
																l'hash dell'importo e del nonce. Una volta
																inviata l'offerta ti indicheremo l'hash che la
																identifica, memorizzalo perchè ti servirà in
																seguito.
															</p>
														</article>
													</div>
													<div class="content" />
													<div className="column is-half is-offset-one-quarter">
														<div className="field has-addons">
															<p className="control">
																<p className="button ">Nonce</p>
															</p>
															<input
																className={
																	this.state.mapInput.NonceBid == false
																		? "input"
																		: errors.NonceBid == true
																		? "input is-danger"
																		: "input"
																}
																type="text"
																onChange={this.handleInputChange}
																placeholder="1000000000000000000"
																name={"NonceBid"}
																value={this.state.NonceBid}
															/>
														</div>
														<div className="field has-addons">
															<p className="control">
																<p className="button ">Wei </p>
															</p>
															<input
																className={
																	this.state.mapInput.bidAmountBid == false
																		? "input"
																		: errors.bidAmountBid == true
																		? "input is-danger"
																		: "input"
																}
																type="text"
																onChange={this.handleInputChange}
																placeholder="1000000000000000000"
																name="bidAmountBid"
																value={this.state.bidAmountBid}
															/>
														</div>
														<div className="column is-half is-offset-one-quarter">
															<p className="control">
																<a
																	className="button is-link"
																	onClick={this.addBid}
																>
																	Invia la tua offerta
																</a>
															</p>
														</div>
													</div>
												</div>
											) : this.state.auctionData.withDrawalPhaseStart <=
													this.state.numeroBlocco &&
											  this.state.numeroBlocco <
													this.state.auctionData.bidOpeningPhaseStart ? (
												<div>
													<h1 className="title is-4">Ritira la tua offerta</h1>
													<div class="tile is-parent">
														<article class="tile is-child notification is-primary">
															<p class="subtitle">
																Inserisci l'hash dell'offerta che hai effettuato
																in precedenza per ritirarla.
															</p>
														</article>
													</div>
													{this.state.ritirato ? (
														<div className="modal is-active">
															<div
																className="modal-background"
																onClick={this.closeModal}
															/>
															<div className="modal-card">
																<header className="modal-card-head">
																	<p className="modal-card-title">
																		Offerta ritirata con successo
																	</p>
																	<button
																		className="delete"
																		onClick={this.closeModal}
																	/>
																</header>
																<section className="modal-card-body">
																	<div className="content">
																		<b>
																			Ti abbiamo riaccreditato metà del deposito
																			che hai inviato in precedenza
																		</b>
																	</div>
																</section>
															</div>
														</div>
													) : (
														<div />
													)}

													<div class="content" />
													<div className="column is-half is-offset-one-quarter">
														<div className="field has-addons">
															<p className="control">
																<p className="button ">Hash</p>
															</p>
															<input
																className={
																	this.state.mapInput.HashRitiro == false
																		? "input"
																		: errors.HashRitiro == true
																		? "input is-danger"
																		: "input"
																}
																type="text"
																onChange={this.handleInputChange}
																placeholder="0x806a017E66E6af90018D4EBa0FFEA7f4d5FDa073"
																name={"HashRitiro"}
																value={this.state.HashRitiro}
															/>
															<p className="control">
																<a
																	className="button is-link"
																	onClick={this.ritiraBid}
																>
																	Ritira Offerta
																</a>
															</p>
														</div>
													</div>
												</div>
											) : this.state.auctionData.bidOpeningPhaseStart <=
													this.state.numeroBlocco &&
											  this.state.numeroBlocco <
													this.state.auctionData.bidOpeningPhaseStart +
														this.state.auctionData.bidOpeningTime ? (
												this.state.aperta ? (
													this.state.highestBidder != this.state.myAccount ? (
														<div>
															<h1 className="title is-4">
																Hai rivelato la tua offerta
															</h1>
															<div class="tile is-parent">
																<article class="tile is-child notification is-primary">
																	<p class="subtitle">
																		La tua offerta è stata superata. Hai perso.
																	</p>
																</article>
															</div>
														</div>
													) : (
														<div>
															<h1 className="title is-4">
																Hai rivelato la tua offerta
															</h1>
															<div class="tile is-parent">
																<article class="tile is-child notification is-primary">
																	<p class="subtitle">
																		Attualmente la tua offerta è la più alta che
																		è stata inviata.
																	</p>
																</article>
															</div>
														</div>
													)
												) : (
													<div>
														<h1 className="title is-4">
															Rivela la tua offerta
														</h1>
														<div class="tile is-parent">
															<article class="tile is-child notification is-primary">
																<p class="subtitle">
																	Inserisci il nonce e la quantità di denaro che
																	hai offerto, in questo modo potremo rivelare
																	la tua offerta per scoprire se hai vinto.
																</p>
															</article>
														</div>
														<div class="content" />

														<div class="content" />
														<div className="column is-half is-offset-one-quarter">
															<div className="field has-addons">
																<p className="control">
																	<p className="button ">Nonce</p>
																</p>
																<input
																	className={
																		this.state.mapInput.NonceOpen == false
																			? "input"
																			: errors.NonceOpen == true
																			? "input is-danger"
																			: "input"
																	}
																	type="text"
																	onChange={this.handleInputChange}
																	placeholder="1000000000000000000"
																	name={"NonceOpen"}
																	value={this.state.NonceOpen}
																/>
															</div>
															<div className="field has-addons">
																<p className="control">
																	<p className="button ">Wei </p>
																</p>
																<input
																	className={
																		this.state.mapInput.BidAmountOpen == false
																			? "input"
																			: errors.BidAmountOpen == true
																			? "input is-danger"
																			: "input"
																	}
																	type="text"
																	onChange={this.handleInputChange}
																	placeholder="1000000000000000000"
																	name={"BidAmountOpen"}
																	value={this.state.BidAmountOpen}
																/>
															</div>
															<div className="column is-half is-offset-one-quarter">
																<p className="control">
																	<a
																		className="button is-link"
																		onClick={this.openBid}
																	>
																		Rivela la tua offerta
																	</a>
																</p>
															</div>
														</div>
													</div>
												)
											) : (
												<div>
													<h1 className="title is-4">Completa l'asta</h1>
													{this.state.finalized ? (
														<div className="modal is-active">
															<div
																className="modal-background"
																onClick={this.closeModal}
															/>
															<div className="modal-card">
																<header className="modal-card-head">
																	<p className="modal-card-title">
																		L'asta è stata terminata con successo
																	</p>
																	<button
																		className="delete"
																		onClick={this.closeModal}
																	/>
																</header>
																<section className="modal-card-body">
																	<div className="content">
																		<b>
																			Il vincitore e il secondo classificato
																			hanno ricevuto il rimborso che gli
																			spettava.
																		</b>
																	</div>
																</section>
															</div>
														</div>
													) : (
														<div />
													)}
													<div class="tile is-parent">
														<article class="tile is-child notification is-primary">
															<p class="subtitle">
																La fase di apertura delle buste è stata
																completata.{" "}
																{this.state.highestBidder ===
																this.state.myAccount
																	? "Sei il vincitore quindi puoi finalizzare l'asta"
																	: this.state.auctionData.auctioneer ===
																	  this.state.myAccount
																	? "Sei il creatore dell'asta quindi puoi finalizzarla"
																	: "Non hai vinto"}
															</p>
														</article>
													</div>
													<div class="content" />
													<div class="content" />
													{this.state.highestBidder == this.state.myAccount ||
													this.state.auctionData.auctioneer ==
														this.state.myAccount ? (
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
													) : (
														<div />
													)}
												</div>
											)
										) : (
											<article className="message is-danger">
												<div className="message-header">
													<p>Avviso!</p>
												</div>
												<div className="message-body">
													Asta non ancora avviata. Attendere.
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
