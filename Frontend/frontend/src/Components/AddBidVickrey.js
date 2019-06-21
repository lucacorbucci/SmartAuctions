import React from "react";
import "bulma/css/bulma.css";
import { VICKREY_ABI } from "../Ethereum/config.js";
import Web3 from "web3";
import abi from "ethereumjs-abi";

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			auctionData: {},
			contratto: "",
			bidAmount: 0,
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			blockNumber: "",
			Phase: -1,
			bidAmountBid: 0,
			Hash: "",
			Value: 0,
			NonceBid: "",
			bidded: false,
			HashRitiro: "",
			ritirato: false,
			NonceOpen: "",
			BidAmountOpen: 0,
			aperta: 0,
			finalized: false
		};
		this.addBid = this.addBid.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.generateHash = this.generateHash.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.ritiraBid = this.ritiraBid.bind(this);
		this.openBid = this.openBid.bind(this);
		this.checkBlock = this.checkBlock.bind(this);
		this.finalize = this.finalize.bind(this);
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

	componentDidMount() {
		const contratto = new this.state.web3.eth.Contract(
			VICKREY_ABI,
			this.props.match.params.contractAddress
		);

		var that = this;
		contratto.methods
			.getAllData()
			.call({ from: this.state.account })
			.then(function(result) {
				that.setState({
					contratto: contratto,
					auctionData: {
						highestBid: parseInt(result[0]._hex),
						secondHighestBid: parseInt(result[1]._hex),
						bidTimeStart: parseInt(result[2]._hex),
						bidTime: parseInt(result[3]._hex),
						bidWithdrawalTime: parseInt(result[4]._hex),
						bidOpeningTime: parseInt(result[5]._hex),
						bidDeposit: parseInt(result[6]._hex),
						reservePrice: parseInt(result[7]._hex),
						isEnded: result[8],
						started: result[9]
					}
				});
				that.checkBlock();
			})
			.catch(err => {
				console.log("Failed with error: " + err);
			});
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
		this.state.contratto.methods
			.addBid(hash)
			.send({
				from: address,
				value: this.state.auctionData.bidDeposit
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				this.setState({
					Hash: hash,
					bidded: true
				});
			});
	}

	async ritiraBid() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.state.contratto.methods
			.withdrawal(this.state.HashRitiro)
			.send({
				from: address
			})
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				this.setState({
					ritirato: true
				});
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
				console.log(receipt);
				this.setState({
					finalized: true
				});
			});
	}

	async openBid() {
		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		var Nonce = this.state.web3.utils.asciiToHex(this.state.NonceOpen, 32);
		console.log(Nonce);
		console.log(address);
		console.log(this.state.BidAmountOpen);
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
					aperta: true
				});
			});
	}

	closeModal() {
		this.setState({
			aperta: false,
			bidded: false,
			ritirato: false,
			finalized: false
		});
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		console.log(name);
		console.log(value);
		this.setState({
			[name]: value
		});
	}

	render() {
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
				<div className="container control">
					<div className="columns">
						<div className="column is-one-third">
							<p className="image">
								<img src="https://cdn.corrieredellosport.it/images/2019/06/12/172034860-211f05c4-c44c-4c85-9084-d3f0f1a483ca.jpg" />
							</p>
						</div>
						<div className="column">
							<div>
								<h1 className="title is-1">{this.props.match.params.Titolo}</h1>
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
								) : this.state.auctionData.started ? (
									this.state.Phase == 0 ? (
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
														l'hash dell'importo e del nonce. Una volta inviata
														l'offerta ti indicheremo l'hash che la identifica,
														memorizzalo perchè ti servirà in seguito.
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
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder="1000000000000000000"
														name={"NonceBid"}
													/>
												</div>
												<div className="field has-addons">
													<p className="control">
														<p className="button ">Wei </p>
													</p>
													<input
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder="1000000000000000000"
														name={"bidAmountBid"}
													/>
												</div>
												<div className="column is-half is-offset-one-quarter">
													<p className="control">
														<a className="button is-link" onClick={this.addBid}>
															Invia la tua offerta
														</a>
													</p>
												</div>
											</div>
										</div>
									) : this.state.Phase == 1 ? (
										<div>
											<h1 className="title is-4">Ritira la tua offerta</h1>
											<div class="tile is-parent">
												<article class="tile is-child notification is-primary">
													<p class="subtitle">
														Inserisci l'hash dell'offerta che hai effettuato in
														precedenza per ritirarla.
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
																	Ti abbiamo riaccreditato metà del deposito che
																	hai inviato in precedenza
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
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder="0x806a017E66E6af90018D4EBa0FFEA7f4d5FDa073"
														name={"HashRitiro"}
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
									) : this.state.Phase == 2 ? (
										<div>
											<h1 className="title is-4">Rivela la tua offerta</h1>
											<div class="tile is-parent">
												<article class="tile is-child notification is-primary">
													<p class="subtitle">
														Inserisci il nonce e la quantità di denaro che hai
														offerto, in questo modo potremo rivelare la tua
														offerta per scoprire se hai vinto.
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
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder="1000000000000000000"
														name={"NonceOpen"}
													/>
												</div>
												<div className="field has-addons">
													<p className="control">
														<p className="button ">Wei </p>
													</p>
													<input
														className="input"
														type="text"
														onChange={this.handleInputChange}
														placeholder="1000000000000000000"
														name={"BidAmountOpen"}
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
																	Il vincitore e il secondo classificato hanno
																	ricevuto il rimborso che gli spettava.
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
														La fase di apertura delle buste è stata completata,
														se sei il vincitore o il creatore, puoi terminare
														l'asta.
													</p>
												</article>
											</div>
											<div class="content" />

											<div class="content" />
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
				</div>
			</div>
		);
	}
}

export default Concluse;
