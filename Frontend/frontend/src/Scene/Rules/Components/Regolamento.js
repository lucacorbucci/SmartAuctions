import React from "react";
import "bulma/css/bulma.css";
import Footer from "../../../Components/Footer";

class Regolamento extends React.Component {
	onUpdate = val => {};
	onBlockNumber = val => {};

	render() {
		return (
			<div>
				<div>
					<section className="hero is-primary is-bold">
						<div className="hero-body">
							<div class="container">
								<h1 className="title is-2">Regolamento</h1>
							</div>
						</div>
					</section>
					<br />
					<div class="container">
						<div class="content is-large">
							Smart Auction permette la creazione di due tipologie di aste,
							inglese e Vickrey.
							<h1 class="title is-1">Tipi di aste</h1>
							<h1 class="title is-3">Asta inglese 🏴󠁧󠁢󠁥󠁮󠁧󠁿 </h1>
							<p>
								Nel caso dell'asta inglese, l'utente che vuole mettere in
								vendita un prodotto sceglie il prezzo di partenza e il minimo
								incremento che deve essere aggiunto ogni volta che viene
								effettuata una nuova offerta. L'asta si conclude se per un
								numero di blocchi deciso dall'utente non vengono inviate nuove
								offerte di valore più alto delle precedenti. Nell'asta inglese
								abbiamo anche la possibilità di acquistare il prodotto
								direttamente senza dover svolgere l'asta, il venditore sceglierà
								un prezzo per l'acquisto diretto e una volta completato questo
								tipo di acquisto l'asta terminerà
							</p>
							<h1 class="title is-3">Asta Vickrey ✅</h1>
							<p>
								Nel caso dell'asta Vickrey il venditore mette in vendita il
								prodotto e sceglie quando avviare l'asta, quando l'asta sarà
								attiva avremo varie fasi:
								<li>
									Nella prima fase gli utenti possono inviare una loro offerta
									sotto forma di hash (hash di un nonce e del valore che
									intendono offrire). Chi fa l'offerta invia anche una quantità
									di denaro specificata dal venditore come caparra.
								</li>
								<li>
									Nella seconda fase gli utenti che hanno fatto un'offerta
									possono ritirarla e riceveranno indietro metà di quanto
									offerto.
								</li>
								<li>
									Nell'ultima fase poi gli utenti possono rivelare la loro
									offerta
								</li>
							</p>
						</div>
					</div>
				</div>
				<Footer onUpdate={this.onUpdate} onBlockNumber={this.onBlockNumber} />
			</div>
		);
	}
}

export default Regolamento;
