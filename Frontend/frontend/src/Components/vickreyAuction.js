import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import { VICKREY_DATA, VICKREY_ABI } from "../Ethereum/config.js";
import Modal from "react-modal";
import Footer from "./Footer";

class VickreyAuction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			contractAddress: "",
			vickreyAuction: "",
			Nome: "",
			url: "",
			baseAsta: "",
			bidPhaseLength: "",
			withdrawalPhaseLength: "",
			bidOpeningPhaseLength: "",
			bidDeposit: "",
			contractCreated: false,
			numBlockStart: ""
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.cancel = this.cancel.bind(this);
		this.startAuction = this.startAuction.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	onUpdate = val => {};

	onBlockNumber = val => {};

	cancel() {
		this.setState({
			Nome: "",
			url: "",
			baseAsta: "",
			bidPhaseLength: "",
			withdrawalPhaseLength: "",
			bidOpeningPhaseLength: "",
			bidDeposit: "",
			numBlockStart: ""
		});
	}

	async handleClick() {
		console.log(this.state.Nome);
		console.log(this.state.url);
		console.log(this.state.baseAsta);
		console.log(this.state.bidPhaseLength);
		console.log(this.state.withdrawalPhaseLength);
		console.log(this.state.bidOpeningPhaseLength);
		console.log(this.state.bidDeposit);

		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		const accounts = await web3.eth.getAccounts();
		const address = accounts[0];

		const contract = new web3.eth.Contract(VICKREY_ABI);
		contract
			.deploy({
				data: VICKREY_DATA,
				arguments: [
					this.state.Nome,
					this.state.url,
					this.state.baseAsta,
					this.state.bidPhaseLength,
					this.state.withdrawalPhaseLength,
					this.state.bidOpeningPhaseLength,
					this.state.bidDeposit,
					this.state.numBlockStart
				]
			})
			.send({
				gas: 4000000,
				gasPrice: 4000000000,
				from: address
			})

			.on("confirmation", (confirmationNumber, receipt) => {
				const newContract = new web3.eth.Contract(
					VICKREY_ABI,
					receipt.contractAddress
				);

				newContract.options.address = receipt.contractAddress;
				this.setState({
					contractAddress: receipt.contractAddress,
					account: address,
					vickreyAuction: newContract,
					contractCreated: true
				});
				console.log(this.state.vickreyAuction);
			});

		this.cancel();
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	startAuction() {
		this.state.vickreyAuction.methods
			.openAuction()
			.send({ from: this.state.account })
			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				this.closeModal();
			});
	}

	closeModal() {
		this.setState({
			contractCreated: false
		});
	}

	render() {
		return (
			<div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div className="container">
							<h1 className="title is-2">Crea una nuova asta Vickrey</h1>
						</div>
					</div>
				</section>
				<br />

				{this.state.contractCreated ? (
					<div className="modal is-active">
						<div className="modal-background" onClick={this.closeModal} />
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">Nuova asta creata</p>
								<button className="delete" onClick={this.closeModal} />
							</header>
							<section className="modal-card-body">
								<div className="content">
									L'asta Vicrey è stata creata correttamente
								</div>
							</section>
						</div>
					</div>
				) : (
					<div />
				)}

				<div className="container control">
					<form
						onSubmit={e => {
							this.handleClick();
							e.preventDefault();
						}}
					>
						<div className="field">
							<label className="label">Cosa vuoi vendere?</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="Nome"
									placeholder="Esempio: Maglia originale autografata da Ciro Immobile"
									value={this.state.Nome}
									onChange={this.handleInputChange}
								/>
							</div>
						</div>

						<div className="field">
							<label className="label">
								URL di una foto del prodotto che vuoi vendere
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="url"
									placeholder="http://www.pointerpodcast.it"
									value={this.state.url}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help">
								Inserendo l'url di una foto del prodotto che vuoi vendere i
								possibili acquirenti potranno capire meglio cosa stanno
								acquistando
							</p>
						</div>

						<div className="field">
							<label className="label">Base d'asta</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="baseAsta"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.baseAsta}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help is-danger">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<div className="field">
							<label className="label">
								Durata della fase di invio delle offerte
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="bidPhaseLength"
									placeholder="Esempio: 10"
									value={this.state.bidPhaseLength}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help ">
								Inserire il numero di blocchi che indicano il periodo in cui
								potranno essere inviate nuove offerte
							</p>
						</div>

						<div className="field">
							<label className="label">
								Numero di blocchi per la fase di ritiro delle offerte
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="withdrawalPhaseLength"
									placeholder="Esempio: 10"
									value={this.state.withdrawalPhaseLength}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help ">
								Inserire il numero di blocchi che indicano il periodo in cui
								possiamo ritirare l'offerta fatta
							</p>
						</div>

						<div className="field">
							<label className="label">
								Numero di blocchi per decretare il vincitore
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="bidOpeningPhaseLength"
									placeholder="Esempio: 10"
									value={this.state.bidOpeningPhaseLength}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help ">
								Inserire il numero di blocchi che indicano la lunghezza della
								fase di apertura delle "buste"
							</p>
						</div>

						<div className="field">
							<label className="label">
								Numero di blocchi per l'avvio dell'asta
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="numBlockStart"
									placeholder="Esempio: 10"
									value={this.state.numBlockStart}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help ">
								Inserisci il numero di blocchi che devono passare prima di
								avviare l'asta
							</p>
						</div>

						<div className="field">
							<label className="label">
								Deposito da inviare insieme all'offerta
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="bidDeposit"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.bidDeposit}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help is-danger">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<br />
						<div className="field is-grouped">
							<div className="control">
								<button type="submit" className="button is-link">
									Submit
								</button>
							</div>
							<div className="control">
								<button
									onClick={e => {
										this.cancel();
										e.preventDefault();
									}}
									className="button is-text"
								>
									Cancel
								</button>
							</div>
						</div>
					</form>
				</div>

				<br />
				<br />
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}
export default VickreyAuction;
