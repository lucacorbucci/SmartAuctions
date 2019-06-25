import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import { ABI_STORAGE, ADDRESS_STORAGE } from "../Ethereum/config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			web3: new Web3(Web3.givenProvider || "http://localhost:8545"),
			myAccount: undefined,
			map: new Map()
		};

		var blockNumber = 0;
		this.notify = this.notify.bind(this);
	}

	update(number) {
		console.log("update " + number);
		this.props.onUpdate(number);
	}

	firstUpdate(number) {
		this.props.onBlockNumber(number);
	}

	async componentDidMount() {
		const subscription = this.state.web3.eth.subscribe("newBlockHeaders");
		var that = this;

		this.state.web3.eth.getBlockNumber().then(data => {
			this.firstUpdate(data);
		});
		subscription.on("data", async (block, error) => {
			if (this.props.auctionDataNonStarted != undefined) {
				this.props.auctionDataNonStarted.forEach(element => {
					if (element.openAuctions_start == block) {
						this.notify("È stata appena avviata una nuova asta", () => {
							if (parseInt(element.openAuctions_Type) == 0) {
								window.open(
									"/addBid/" + element.openAuctions_ContractAddress,
									"_self"
								);
							} else {
								window.open(
									"/addBidVickrey/" + element.openAuctions_ContractAddress,
									"_self"
								);
							}
						});
					}
				});
			}

			that.blockNumber = block.number;

			this.update(that.blockNumber);
		});

		const contratto = new this.state.web3.eth.Contract(
			ABI_STORAGE,
			ADDRESS_STORAGE
		);

		const accounts = await this.state.web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({
			myAccount: address
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

		contratto.events
			.newAuction()
			.on("data", event => {
				console.log("NUOVA ASTA");
				if (!this.state.map.has(event.id)) {
					this.notify("È stata aggiunta una nuova asta", () => {
						if (parseInt(event.returnValues[1]) == 0) {
							window.open("/addBid/" + event.returnValues[0], "_self");
						} else {
							window.open("/addBidVickrey/" + event.returnValues[0], "_self");
						}
					});
					this.state.map.set(event.id, true);
				}
			})

			.on("error", console.error);
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

	render() {
		return (
			<div>
				<div className="app-content">
					<ToastContainer />
				</div>
				<footer className="footer">
					<div className="content has-text-centered">
						<p>
							<strong>
								Peer to Peer Systems and Blockchains Academic Year 2018/2019
							</strong>
							<br />
							<h6>Development of a Dapp for Smart Auctions</h6>
							Developed by Luca Corbucci
							<p>Your account: {this.state.myAccount}</p>
						</p>
					</div>
				</footer>
			</div>
		);
	}
}
export default Footer;
