import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import { VICKREY_DATA, VICKREY_ABI } from "../Ethereum/config.js";
import Modal from "react-modal";
import Footer from "./Footer";
import { css } from "@emotion/core";
import { PacmanLoader } from "react-spinners";

const override = css`
	display: block;
	margin: 0 auto;
	border-color: red;
`;

function validate(
	Nome,
	url,
	baseAsta,
	bidPhaseLength,
	withdrawalPhaseLength,
	bidOpeningPhaseLength,
	bidDeposit,
	numBlockStart
) {
	console.log("cal");
	return {
		Nome: Nome.length === 0,
		url: url.length === 0,
		baseAsta: baseAsta.length === 0 || isNaN(baseAsta) || baseAsta < 0,
		bidPhaseLength:
			bidPhaseLength.length === 0 ||
			isNaN(bidPhaseLength) ||
			bidPhaseLength < 0,
		withdrawalPhaseLength:
			withdrawalPhaseLength.length === 0 ||
			isNaN(withdrawalPhaseLength) ||
			withdrawalPhaseLength < 0,
		bidOpeningPhaseLength:
			bidOpeningPhaseLength.length === 0 ||
			isNaN(bidOpeningPhaseLength) ||
			bidOpeningPhaseLength < 0,
		bidDeposit: bidDeposit.length === 0 || isNaN(bidDeposit) || bidDeposit < 0,
		numBlockStart:
			numBlockStart.length === 0 || isNaN(numBlockStart) || numBlockStart < 0
	};
}

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
			numBlockStart: "",
			mapInput: {
				Nome: false,
				url: false,
				baseAsta: false,
				bidPhaseLength: false,
				withdrawalPhaseLength: false,
				bidOpeningPhaseLength: false,
				bidDeposit: false,
				numBlockStart: false
			},
			onSubmit: false,
			errore: false
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
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		const accounts = await web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({
			onSubmit: true
		});

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
					onSubmit: false,
					contractCreated: true
				});
				console.log(this.state.vickreyAuction);
			})
			.on("error", () => {
				this.setState({
					errore: true,
					onSubmit: false,
					contractCreated: true
				});
			});

		this.cancel();
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;
		this.state.mapInput[name] = true;

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
			contractCreated: false,
			onSubmit: false
		});
	}

	render() {
		const errors = validate(
			this.state.Nome,
			this.state.url,
			this.state.baseAsta,
			this.state.bidPhaseLength,
			this.state.withdrawalPhaseLength,
			this.state.bidOpeningPhaseLength,
			this.state.bidDeposit,
			this.state.numBlockStart
		);
		const isDisabled = Object.keys(errors).some(x => errors[x]);

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
				this.state.contractCreated ? ( this.state.errore ? (
				<div className="modal is-active">
					<div className="modal-background" onClick={this.closeModal} />
					<div className="modal-card">
						<header className="modal-card-head">
							<p className="modal-card-title">Impossibile creare l'asta</p>
							<button className="delete" onClick={this.closeModal} />
						</header>
						<section className="modal-card-body">
							<div className="content">
								Si è verificato un errore imprevisto.
							</div>
						</section>
					</div>
				</div>
				) : (
				<div className="modal is-active">
					<div className="modal-background" onClick={this.closeModal} />
					<div className="modal-card">
						<header className="modal-card-head">
							<p className="modal-card-title">Nuova asta creata</p>
							<button className="delete" onClick={this.closeModal} />
						</header>
						<section className="modal-card-body">
							<div className="content">
								L'asta Vickrey è stata creata correttamente
							</div>
						</section>
					</div>
				</div>
				) ) : (
				<div />
				)}
				{this.state.onSubmit ? (
					<div className="modal is-active">
						<div className="modal-background" onClick={this.closeModal} />
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">
									Attendi la creazione dell'asta
								</p>
								<button className="delete" onClick={this.closeModal} />
							</header>
							<section className="modal-card-body">
								Potrebbero volerci fino a 30 secondi
								<br />
								<br />
								<div className="PacmanLoader">
									<PacmanLoader
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
									className={
										this.state.mapInput.Nome == false
											? "input"
											: errors.Nome
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.url == false
											? "input"
											: errors.url
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.baseAsta == false
											? "input"
											: errors.baseAsta
											? "input is-danger"
											: "input"
									}
									type="text"
									name="baseAsta"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.baseAsta}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<div className="field">
							<label className="label">
								Durata della fase di invio delle offerte
							</label>
							<div className="control">
								<input
									className={
										this.state.mapInput.bidPhaseLength == false
											? "input"
											: errors.bidPhaseLength
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.withdrawalPhaseLength == false
											? "input"
											: errors.withdrawalPhaseLength
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.bidOpeningPhaseLength == false
											? "input"
											: errors.bidOpeningPhaseLength
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.numBlockStart == false
											? "input"
											: errors.numBlockStart
											? "input is-danger"
											: "input"
									}
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
									className={
										this.state.mapInput.bidDeposit == false
											? "input"
											: errors.bidDeposit
											? "input is-danger"
											: "input"
									}
									type="text"
									name="bidDeposit"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.bidDeposit}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<br />
						<div className="field is-grouped">
							<div className="control">
								<button
									type="submit"
									className="button is-link"
									disabled={isDisabled}
								>
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
