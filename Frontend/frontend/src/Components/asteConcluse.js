import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";

class Concluse extends React.Component {
	render() {
		return (
			<div>
				<section className="hero is-primary is-bold">
					<div className="hero-body">
						<div class="container">
							<h1 className="title is-2">Aste concluse</h1>
							<nav className="level">
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Aste concluse</p>
										<p className="title">3,456</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Aste in corso</p>
										<p className="title">123</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Prodotti venduti</p>
										<p className="title">456K</p>
									</div>
								</div>
								<div className="level-item has-text-centered">
									<div>
										<p className="heading">Offerte</p>
										<p className="title">789</p>
									</div>
								</div>
							</nav>
						</div>
					</div>
				</section>
				<br />
				<div style={{ margin: 10 }}>
					<TileAsta
						auctionData={[
							{ Title: "Test", Url: "Ciao" },
							{ Title: "Test2", Url: "Ciao2" },
							{ Title: "Test3", Url: "Ciao3" },
							{ Title: "Test4", Url: "Ciao4" },
							{ Title: "Test5", Url: "Ciao5" },
							{ Title: "Test6", Url: "Ciao6" },
							{ Title: "Test7", Url: "Ciao6" },
							{ Title: "Test8", Url: "Ciao6" },
							{ Title: "Test8", Url: "Ciao6" }
						]}
					/>
				</div>
			</div>
		);
	}
}

export default Concluse;
