import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "../Ethereum/config.js";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.addNotification = this.addNotification.bind(this);
		this.notificationDOMRef = React.createRef();
	}

	addNotification() {
		this.notificationDOMRef.current.addNotification({
			title: "Awesomeness",
			message: "Awesome Notifications!",
			type: "info",
			insert: "top",
			container: "top-right",
			animationIn: ["animated", "fadeIn"],
			animationOut: ["animated", "fadeOut"],
			dismiss: { duration: 2000 },
			dismissable: { click: true }
		});
	}
	componentDidMount() {
		const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
		const subscription = web3.eth.subscribe("newBlockHeaders");

		subscription.on("data", async (block, error) => {
			this.addNotification();
		});
	}
	render() {
		return (
			<div>
				<div className="app-content">
					<ReactNotification ref={this.notificationDOMRef} />
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
						</p>
					</div>
				</footer>
			</div>
		);
	}
}
export default Footer;
