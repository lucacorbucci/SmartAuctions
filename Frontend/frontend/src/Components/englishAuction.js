import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import {
	TODO_LIST_ABI,
	ABI_STORAGE,
	ADDRESS_STORAGE
} from "../Ethereum/config.js";
import Modal from "react-modal";

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)"
	}
};

class Contact extends React.Component {
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
			contractCreated: false
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.cancel = this.cancel.bind(this);
		this.startAuction = this.startAuction.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	cancel() {
		this.setState({
			Nome: "",
			url: "",
			baseAsta: "",
			minIncr: "",
			acquistoDiretto: "",
			numBlocks: ""
		});
	}

	async handleClick() {
		console.log(this.state.Nome);
		console.log(this.state.url);
		console.log(this.state.baseAsta);
		console.log(this.state.minIncr);
		console.log(this.state.acquistoDiretto);
		console.log(this.state.numBlocks);

		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		const accounts = await web3.eth.getAccounts();
		const address = accounts[0];

		const contract = new web3.eth.Contract(TODO_LIST_ABI);

		contract
			.deploy({
				data:
					"0x60806040526000600760146101000a81548160ff0219169083151502179055506000600760156101000a81548160ff0219169083151502179055506000600760166101000a81548160ff0219169083151502179055506040516200138e3803806200138e833981018060405260c08110156200007a57600080fd5b8101908080516401000000008111156200009357600080fd5b82810190506020810184811115620000aa57600080fd5b8151856001820283011164010000000082111715620000c857600080fd5b50509291906020018051640100000000811115620000e557600080fd5b82810190506020810184811115620000fc57600080fd5b81518560018202830111640100000000821117156200011a57600080fd5b505092919060200180519060200190929190805190602001909291908051906020019092919080519060200190929190505050600084116200015b57600080fd5b600082116200016957600080fd5b8360008190555082600181905550600182026002819055508060038190555033600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508560099080519060200190620001e192919062000207565b5084600a9080519060200190620001fa92919062000207565b50505050505050620002b6565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200024a57805160ff19168380011785556200027b565b828001600101855582156200027b579182015b828111156200027a5782518255916020019190600101906200025d565b5b5090506200028a91906200028e565b5090565b620002b391905b80821115620002af57600081600090555060010162000295565b5090565b90565b6110c880620002c66000396000f3fe6080604052600436106100e75760003560e01c80637150d8ae1161008a578063ade751bd11610059578063ade751bd146102d2578063d57bde79146102fd578063db2e1eed14610328578063ff21d1e514610353576100e7565b80637150d8ae146101ef5780637f3d06a61461024657806391f9015714610271578063acaee58f146102c8576100e7565b80634979440a116100c65780634979440a146101645780634bb278f31461018f5780636560cb30146101995780636c2b707a146101c4576100e7565b80623495a4146100ec57806304cb72f9146101435780631998aeef1461015a575b600080fd5b3480156100f857600080fd5b5061010161037e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561014f57600080fd5b506101586103a8565b005b6101626104a8565b005b34801561017057600080fd5b50610179610869565b6040518082815260200191505060405180910390f35b610197610873565b005b3480156101a557600080fd5b506101ae610c35565b6040518082815260200191505060405180910390f35b3480156101d057600080fd5b506101d9610c3b565b6040518082815260200191505060405180910390f35b3480156101fb57600080fd5b50610204610c45565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561025257600080fd5b5061025b610c6b565b6040518082815260200191505060405180910390f35b34801561027d57600080fd5b50610286610c71565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102d0610c97565b005b3480156102de57600080fd5b506102e7610ff8565b6040518082815260200191505060405180910390f35b34801561030957600080fd5b50610312611002565b6040518082815260200191505060405180910390f35b34801561033457600080fd5b5061033d611008565b6040518082815260200191505060405180910390f35b34801561035f57600080fd5b5061036861100e565b6040518082815260200191505060405180910390f35b6000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461046b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260148152602001807f4e6f6e20736569206c2761756374696f6e65657200000000000000000000000081525060200191505060405180910390fd5b60001515600760169054906101000a900460ff1615151461048b57600080fd5b6001600760166101000a81548160ff021916908315150217905550565b600760149054906101000a900460ff161561052b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f41737461207465726d696e61746100000000000000000000000000000000000081525060200191505060405180910390fd5b34803373ffffffffffffffffffffffffffffffffffffffff163110156105b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f42616c616e6365206e6f6e2073756666696369656e746500000000000000000081525060200191505060405180910390fd5b600760169054906101000a900460ff1661063b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f41737461206e6f6e20617676696174610000000000000000000000000000000081525060200191505060405180910390fd5b60001515600760159054906101000a900460ff16151514156106865760005434101561066657600080fd5b6001600760156101000a81548160ff0219169083151502179055506106cd565b61069d60035460085461101490919063ffffffff16565b4311156106a957600080fd5b6106c060015460045461101490919063ffffffff16565b3410156106cc57600080fd5b5b600060045490506000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690503460048190555033600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550436008819055507ff4757a49b326036464bec6fe419a4ae38c8a02ce3e68bf0809674f6aab8ad300600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600454604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600082141580156108175750600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b15610864578073ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f19350505050158015610862573d6000803e3d6000fd5b505b505050565b6000600454905090565b600760149054906101000a900460ff16156108f6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f41737461207465726d696e61746100000000000000000000000000000000000081525060200191505060405180910390fd5b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061099f5750600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b610a11576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600f8152602001807f4e6f6e206175746f72697a7a61746f000000000000000000000000000000000081525060200191505060405180910390fd5b43610a2960035460085461101490919063ffffffff16565b10610a9c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f41737461206e6f6e207465726d696e617461000000000000000000000000000081525060200191505060405180910390fd5b600760169054906101000a900460ff16610b1e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f41737461206e6f6e20617676696174610000000000000000000000000000000081525060200191505060405180910390fd5b6001600760146101000a81548160ff0219169083151502179055507fdaec4582d5d9595688c8c98545fdd1c696d41c6aeaeb636737e84ed2f5c00eda600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600454604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6004549081150290604051600060405180830381858888f19350505050158015610c32573d6000803e3d6000fd5b50565b60015481565b6000600254905090565b600660009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60025481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600760149054906101000a900460ff1615610d1a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f41737461207465726d696e61746100000000000000000000000000000000000081525060200191505060405180910390fd5b60001515600760159054906101000a900460ff16151514610da3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f4e6f6e20616371756973746162696c6520646972657474616d656e746500000081525060200191505060405180910390fd5b600254803373ffffffffffffffffffffffffffffffffffffffff16311015610e33576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260178152602001807f42616c616e6365206e6f6e2073756666696369656e746500000000000000000081525060200191505060405180910390fd5b600760169054906101000a900460ff16610eb5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260108152602001807f41737461206e6f6e20617676696174610000000000000000000000000000000081525060200191505060405180910390fd5b6002543414610ec357600080fd5b7fdaec4582d5d9595688c8c98545fdd1c696d41c6aeaeb636737e84ed2f5c00eda3334604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a16001600760146101000a81548160ff02191690831515021790555033600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f19350505050158015610ff4573d6000803e3d6000fd5b5050565b6000600154905090565b60045481565b60005481565b60035481565b600080828401905083811015611092576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b809150509291505056fea165627a7a723058200746d94091917547cc38d4bd1b939edb9a8fa5b9102c19a2bc9e5fac3373f3ab0029",
				arguments: [
					this.state.Nome,
					this.state.url,
					this.state.baseAsta,
					this.state.minIncr,
					this.state.acquistoDiretto,
					this.state.numBlocks
				]
			})
			.send({
				from: address
			})

			.on("confirmation", (confirmationNumber, receipt) => {
				const newContract = new web3.eth.Contract(
					TODO_LIST_ABI,
					receipt.contractAddress
				);
				const storageContract = new web3.eth.Contract(
					ABI_STORAGE,
					ADDRESS_STORAGE
				);

				newContract.options.address = receipt.contractAddress;
				this.setState({
					contractAddress: receipt.contractAddress,
					account: address,
					englishAuction: newContract,
					contractCreated: true
				});
				console.log(this.state.englishAuction);

				storageContract.methods
					.addContract(this.state.account, receipt.contractAddress)
					.send({ from: this.state.account })
					.on("confirmation", (confirmationNumber, receipt) => {
						console.log("STORATO");
					});
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
		this.state.englishAuction.methods
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
							<h1 className="title is-2">Crea una nuova asta inglese</h1>
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
								<div className="content">Vuoi avviare l'asta?</div>
							</section>
							<footer className="modal-card-foot">
								<a className="button is-success" onClick={this.startAuction}>
									Avvia l'asta
								</a>
								<a className="button" onClick={this.closeModal}>
									Avvia in seguito
								</a>
							</footer>
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
							<label className="label">Valore minimo dell'incremento</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="minIncr"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.minIncr}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help is-danger">
								Importante: Il prezzo va specificato in Wei
							</p>
						</div>

						<div className="field">
							<label className="label">
								Prezzo del prodotto per acquisto diretto
							</label>
							<div className="control">
								<input
									className="input"
									type="text"
									name="acquistoDiretto"
									placeholder="Esempio: 1000000000000000000"
									value={this.state.acquistoDiretto}
									onChange={this.handleInputChange}
								/>
							</div>
							<p className="help is-danger">
								Importante: Il prezzo va specificato in Wei
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
			</div>
		);
	}
}
export default Contact;
