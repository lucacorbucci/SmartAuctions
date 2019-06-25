import React, { Component } from "react";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./Ethereum/config.js";
import Navbar from "./Components/Navbar";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			account: "",
			isActive: false
		};
	}

	componentWillMount() {
		this.loadBlockchainData();
	}

	async loadBlockchainData() {
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
	}

	toggleNav = () => {
		this.setState(prevState => ({
			isActive: !prevState.isActive
		}));
	};

	render() {
		var links = ["/", "/asteconcluse", "/lemieaste", "/regolamento"];
		var menuItems = ["Home", "Aste concluse", "Le mie aste", "Regolamento"];
		return (
			<div>
				<div className="container" />
				<Navbar menuItems={menuItems} links={links} />
			</div>
		);
	}
}

export default App;
