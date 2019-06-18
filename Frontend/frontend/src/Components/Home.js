import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";

class Contact extends React.Component {
	render() {
		return (
			<div>
				<section className="hero is-medium is-primary is-bold">
					<div className="hero-body">
						<div className="container">
							<div margin="0">
								<h1 className="title is-1">Benvenuto!</h1>
							</div>

							<h1 className="title is-2">Crea subito una nuova asta</h1>

							<br />

							<div className="field is-grouped">
								<p className="control">
									<a
										className="button is-medium is-hovered is-link is-rounded"
										href={"/addAstaInglese"}
									>
										Asta Inglese
									</a>
								</p>
								<p className="control">
									<a
										className="button is-medium is-link is-hovered is-rounded"
										href="addAstaVickrey"
									>
										Asta Vickrey
									</a>
								</p>
							</div>
						</div>
					</div>
				</section>
				<br />
				<div>
					<div style={{ textAlign: "center" }}>
						<h1 className="title is-2">Aste in corso</h1>
					</div>
				</div>
				<div>
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
export default Contact;
