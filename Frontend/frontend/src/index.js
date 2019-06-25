import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import * as serviceWorker from "./serviceWorker";
import englishAuction from "./Components/englishAuction";
import Home from "./Components/Home";
import AsteConcluse from "./Components/asteConcluse";
import Regolamento from "./Components/Regolamento";
import AstaInglese from "./Components/englishAuction";
import AstaVickrey from "./Components/vickreyAuction";

import AddBid from "./Components/AddBid";
import AddBidVickrey from "./Components/AddBidVickrey";
import LeMieAste from "./Components/LeMieAste";

const routing = (
	<Router>
		<div>
			<Route path="/" component={Header} />

			<Route exact path="/" component={Home} />
			<Route path="/home" component={Home} />
			<Route path="/englishAuction" component={englishAuction} />
			<Route path="/asteconcluse" component={AsteConcluse} />
			<Route path="/regolamento" component={Regolamento} />
			<Route path="/addAstaInglese" component={AstaInglese} />
			<Route path="/addAstaVickrey" component={AstaVickrey} />
			<Route path="/addBid/:contractAddress/" component={AddBid} />
			<Route path="/lemieaste" component={LeMieAste} />

			<Route
				path="/addBidVickrey/:contractAddress/"
				component={AddBidVickrey}
			/>
		</div>
	</Router>
);
ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
