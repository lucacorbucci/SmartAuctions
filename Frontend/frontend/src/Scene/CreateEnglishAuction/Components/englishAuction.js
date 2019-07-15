import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import {
	ENGLISH_DATA,
	ENGLISH_ABI
} from "../../../Services/Ethereum/config.js";
import Footer from "../../../Components/Footer";
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
	minIncr,
	numBlocks,
	acquistoDiretto,
	numBlockStart
) {
	return {
		Nome: Nome.length === 0,
		url: url.length === 0,
		baseAsta: baseAsta.length === 0 || isNaN(baseAsta) || baseAsta < 0,
		minIncr: minIncr.length === 0 || isNaN(minIncr) || minIncr < 0,
		acquistoDiretto:
			acquistoDiretto.length === 0 ||
			isNaN(acquistoDiretto) ||
			acquistoDiretto < 0,
		numBlocks: numBlocks.length === 0 || isNaN(numBlocks) || numBlocks < 0,
		numBlockStart:
			numBlockStart.length === 0 || isNaN(numBlockStart) || numBlockStart < 0
	};
}

class EnglishAuction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			contractAddress: "",
			englishAuction: "",
			Nome: "",
			url: "",
			baseAsta: "",
			minIncr: "",
			acquistoDiretto: "",
			numBlocks: "",
			contractCreated: false,
			numBlockStart: "",
			mapInput: {
				Nome: false,
				url: false,
				baseAsta: false,
				minIncr: false,
				numBlocks: false,
				acquistoDiretto: false,
				numBlockStart: false
			},
			onSubmit: false,
			errore: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.cancel = this.cancel.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeModalAttesa = this.closeModalAttesa.bind(this);
	}

	onUpdate = val => {};

	onBlockNumber = val => {};

	cancel() {
		this.setState({
			Nome: "",
			url: "",
			baseAsta: "",
			minIncr: "",
			acquistoDiretto: "",
			numBlocks: "",
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

		const contract = new web3.eth.Contract(ENGLISH_ABI);
		contract
			.deploy({
				data: ENGLISH_DATA,
				arguments: [
					this.state.Nome,
					this.state.url,
					this.state.baseAsta,
					this.state.minIncr,
					this.state.acquistoDiretto,
					this.state.numBlocks,
					this.state.numBlockStart
				]
			})
			.send({
				gas: 4000000,
				gasPrice: 4000000000,
				from: address
			})

			.on("confirmation", (confirmationNumber, receipt) => {
				console.log(receipt);
				const newContract = new web3.eth.Contract(
					ENGLISH_ABI,
					receipt.contractAddress
				);

				newContract.options.address = receipt.contractAddress;
				this.setState({
					onSubmit: false,
					contractAddress: receipt.contractAddress,
					account: address,
					englishAuction: newContract,
					contractCreated: true
				});
				console.log(this.state.englishAuction);
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

	closeModal() {
		this.setState({
			contractCreated: false,
			onSubmit: false,
			errore: false
		});
	}

	closeModalAttesa() {
		this.setState({
			onSubmit: false
		});
	}

	render() {
		const errors = validate(
			this.state.Nome,
			this.state.url,
			this.state.baseAsta,
			this.state.minIncr,
			this.state.numBlocks,
			this.state.acquistoDiretto,
			this.state.numBlockStart
		);
		const isDisabled = Object.keys(errors).some(x => errors[x]);

		return (
			<div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div className="container">
							<h1 className="title is-2">Crea una nuova asta inglese</h1>
						</div>
					</div>
				</section>
				<br />

				{this.state.contractCreated ? (
					this.state.errore ? (
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
										L'asta inglese è stata creata correttamente
									</div>
								</section>
							</div>
						</div>
					)
				) : (
					<div />
				)}

				{this.state.onSubmit ? (
					<div className="modal is-active">
						<div className="modal-background" onClick={this.closeModalAttesa} />
						<div className="modal-card">
							<header className="modal-card-head">
								<p className="modal-card-title">
									Attendi la creazione dell'asta
								</p>
								<button className="delete" onClick={this.closeModalAttesa} />
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
							{/*
							<div className="file has-name">
								<label className="file-label">
									<input className="file-input" type="file" name="resume" />
									<span className="file-cta">
										<span className="file-icon">
											<i className="fas fa-upload" />
										</span>
										<span className="file-label">Choose a file…</span>
									</span>
									<span className="file-name">
										Screen Shot 2017-07-29 at 15.54.25.png
									</span>
								</label>
							</div>
							*/}
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
							<label className="label">Valore minimo dell'incremento</label>
							<div className="control">
								<input
									className={
										this.state.mapInput.minIncr == false
											? "input"
											: errors.minIncr
											? "input is-danger"
											: "input"
									}
									type="text"
									name="minIncr"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.minIncr}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<div className="field">
							<label className="label">
								Prezzo del prodotto per acquisto diretto
							</label>
							<div className="control">
								<input
									className={
										this.state.mapInput.acquistoDiretto == false
											? "input"
											: errors.acquistoDiretto
											? "input is-danger"
											: "input"
									}
									type="text"
									name="acquistoDiretto"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.acquistoDiretto}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<div className="field">
							<label className="label">
								Numero di blocchi per decretare il vincitore
							</label>
							<div className="control">
								<input
									className={
										this.state.mapInput.numBlocks == false
											? "input"
											: errors.numBlocks
											? "input is-danger"
											: "input"
									}
									type="text"
									name="numBlocks"
									placeholder="Esempio: 10"
									value={this.state.numBlocks}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help ">
								Inserisci il numero di blocchi senza nuove offerte che dovranno
								passare prima di decretare il vincitore
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
export default EnglishAuction;
