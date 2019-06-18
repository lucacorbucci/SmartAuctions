import React from "react";
import "bulma/css/bulma.css";
import TileAsta from "./TileAsta";
import ParticleComponent from "./Particles";

class Contact extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mounted: false,
			width: "",
			heigth: ""
		};
	}

	updateDimensions() {
		var tmp = document.getElementById("cnt");
		this.setState({
			mounted: true,
			width: tmp.offsetWidth,
			heigth: tmp.offsetHeight
		});
	}

	componentDidMount() {
		var tmp = document.getElementById("cnt");
		this.setState({
			mounted: true,
			width: tmp.offsetWidth,
			heigth: tmp.offsetHeight
		});
		window.addEventListener("resize", this.updateDimensions.bind(this));
	}

	render() {
		return (
			<div>
				<div className="hero is-medium is-primary is-bold">
					{this.state.mounted ? (
						<ParticleComponent
							heigth={this.state.heigth}
							width={this.state.width}
						/>
					) : (
						<div />
					)}
					<div id="cnt" className="hero-body">
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
				</div>
				<br />

				<div>
					<div style={{ textAlign: "center" }}>
						<h1 className="title is-2">Aste in corso</h1>
					</div>
				</div>
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
export default Contact;
