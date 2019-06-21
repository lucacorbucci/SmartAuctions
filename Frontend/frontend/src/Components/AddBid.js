import React from "react";
import "bulma/css/bulma.css";
import { ENGLISH_ABI } from "../Ethereum/config.js";
import Web3 from "web3";
import Footer from "./Footer";

class Concluse extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hovered: false,
			auctionData: {},
			contratto: "",
			bidAmount: 0,
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			numeroBlocco: 0,
			started: false
		};
		this.AcquistaDiretto = this.AcquistaDiretto.bind(this);
		this.addBid = this.addBid.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.onBlockNumber = this.onBlockNumber.bind(this);

		var blockNumber = 0;
	}

	onUpdate = val => {
		if (
			this.state.auctionData.auctionStart +
				this.state.auctionData.blocchiStart <=
				val &&
			this.state.started == false
		) {
			console.log("ok stato aggiornato");
			this.setState({
				numeroBlocco: val,
				started: true
			});
		}
		this.blockNumber = val;
	};

	onBlockNumber(val) {
		this.setState({
			numeroBlocco: val
		});
		this.blockNumber = val;
	}

	componentWillMount() {
		const contratto = new this.state.web3.eth.Contract(
			ENGLISH_ABI,
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
					}
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
				console.log(receipt);
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
				console.log(receipt);
			});
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		this.setState({
			bidAmount: value
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
								) : this.state.auctionData.auctionStart +
										this.state.auctionData.blocchiStart <=
								  this.state.numeroBlocco ? (
									<div>
										<h1 className="title is-4">Fai un'offerta</h1>
										<div class="tile is-parent">
											<article class="tile is-child notification is-primary">
												<p class="subtitle">
													{this.state.auctionData.highestBid > 0
														? "Ehi, ci sono già delle offerte per questo prodotto. Offri almeno " +
														  parseInt(
																parseInt(this.state.auctionData.highestBid) +
																	parseInt(this.state.auctionData.minIncrement)
														  )
														: "Nessuno ha ancora fatto un'offerta, vuoi essere il primo? Offri almeno " +
														  this.state.auctionData.reservePrice}{" "}
													Wei per partecipare all'asta!
												</p>
											</article>
										</div>

										<div class="content" />
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
																	parseInt(this.state.auctionData.highestBid) +
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
				</div>
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}

export default Concluse;
