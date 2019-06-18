import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import * as serviceWorker from "./serviceWorker";
import englishAuction from "./Components/englishAuction";
import Home from "./Components/Home";

const routing = (
	<Router>
		<div>
			<Route path="/" component={Header} />
			<Route exact path="/" component={Home} />
			<Route path="/home" component={Home} />
			<Route path="/englishAuction" component={englishAuction} />
		</div>
	</Router>
);
ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
