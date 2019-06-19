import React from "react";
import "bulma/css/bulma.css";
import Web3 from "web3";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "../Ethereum/config.js";

class Footer extends React.Component {
	render() {
		return (
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
		);
	}
}
export default Footer;
