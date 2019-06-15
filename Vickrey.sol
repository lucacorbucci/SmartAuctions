pragma solidity ^0.5.1;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";


contract Vickrey {
    using SafeMath for uint;
    
    // Prezzo minimo dell'asta
    uint reservePrice;
    // Deposito minimo
    uint public bidDeposit;
    // Prezzo che viene restituito in caso di ritiro
    uint refundPrice;
    // Creatore dell'asta
    address payable auctioneer;
    
    // blocco in cui inizia l'asta e durata della bid Phase
    uint bidTimeStart;
    uint bidTime;

    // tempo (in blocchi) della withdrawal phase
    uint withdrawalTime;
    
    // tempo (in blocchi) della fase di apertura delle offerte
    uint bidOpeningTime;
    
    // variabili usate per memorizzare l'offerta più alta e chi l'ha presentata
    // stesso discorso con la seconda offerta più alta.
    uint public highestBid;
    uint public secondHighestBid;
    address payable highestBidder;
    address payable secondhighestBidder;
    
    // Memorizzo la coppia (indirizzo, hash offerta)
    mapping (address => bytes32) bids;
    
    // Un booleano per capire se l'asta è iniziata e uno per capire se è finita
    bool started = false;
    bool ended = false;
    
    // Nome del prodotto che viene messo in vendita e URL di una foto
    string title;
    string URL;
    
    /*
        Parametri:
        - _title = nome del prodotto che viene messo in vendita con l'asta
        - _URL = url di una foto del prodotto
        - _reservePrice = prezzo minimo che deve essere pagato
        - _bidTime = tempo (misurato in numero di blocchi) della fase in cui è possibile
        fare le offerte
        - _withdrawalTime = tempo (misurato in numero di blocchi) della fase in cui è possibile
        ritirare le offerte
        - _bidOpeningTime = tempo (misurato in numero di blocchi) della fase in cui è possibile
        aprire le "buste" con le offerte
        - _bidDeposit = deposito che deve essere lasciato da chi fa un'offerta
    */
    constructor(string memory _title, string memory _URL, uint _reservePrice, uint _bidTime, uint _withdrawalTime, uint _bidOpeningTime, uint _bidDeposit) public payable{
        require(_reservePrice > 0, "reserve > 0");
        reservePrice = _reservePrice;
        auctioneer = msg.sender;
        bidTime = _bidTime;
        withdrawalTime = _withdrawalTime;
        bidOpeningTime = _bidOpeningTime;
        bidDeposit = _bidDeposit;
        // a refundPrice assegno la metà del _bidDeposit perchè quando ritiro l'offferta
        // dobbiamo restituire la metà di quanto è stato lasciato come deposito. 
        refundPrice = _bidDeposit.div(2);
        secondHighestBid = reservePrice;
        title = _title;
        URL = _URL;
    }
    
    // Controlla che l'asta sia stata avviata e che la fase di invio delle offerte non 
    // sia ancora completata
    modifier only_when_BidPhase(){
        require(started == true, "Asta non iniziata");
        require(block.number <= bidTimeStart.add(bidTime), "Bid Phase ended"); _;
    }
    
    // Controlla che la fase di invio delle offerte sia terminata, che siamo nella fase Withdrawal
    // e che l'asta è stata avviata
    modifier only_when_WithdrawalPhase(){
        require(started == true, "Asta non iniziata");
        require(block.number > bidTimeStart.add(bidTime), "Bid Phase non terminata");
        require(block.number <= (bidTimeStart.add(bidTime)).add(withdrawalTime), "Withdrawal Phase terminata"); _;
    }
    
    modifier only_when_openBid(){
        require(started == true, "Asta non iniziata");
        require(block.number > (bidTimeStart.add(bidTime)).add(withdrawalTime), "Withdrawal Phase non terminata");
        require(block.number <= ((bidTimeStart.add(bidTime)).add(withdrawalTime)).add(bidOpeningTime), "Open Bid Phase terminata"); _;
    }
    
     // Controlla che l'asta sia stata avviata
    modifier only_when_auctionStarted(){
        require(started == true, "asta non iniziata"); _;
    }
    
    // Controlla che la funzione sia stata chiamata dal creatore dell'asta
    modifier only_auctioneer(){
        require(msg.sender == auctioneer, "non sei l'auctioneer"); _;
    }
    
    modifier only_when_openBidPhaseEnded(){
        require(started == true, "Asta non iniziata");
        require(ended == false, "Asta terminata");
        require(block.number > ((bidTimeStart.add(bidTime)).add(withdrawalTime)).add(bidOpeningTime), "Open Bid Phase non terminata"); _;
    }
    
    // Controlla che chi fa l'offerta abbia a disposizione un balance maggiore di 
    // quanto offre
    modifier balanceAvailable(uint price){
        require(msg.sender.balance >= price, "Balance non sufficiente"); _;
    }
    
    
    /*
        Inizio dell'asta, solamente il creatore dell'asta può avviarla
    */
    function openAuction() public only_auctioneer(){
        require(started == false);
        started = true;
        bidTimeStart = block.number;
    }
    
    event HighestBidIncreased(address bidder, address secondBidder);

    event AuctionEnded(address winner, uint amount);
    
    
    /*
        Aggiunta di una nuova offerta, possiamo aggiungere l'offerta solamente dopo
        che l'asta è stata avviata e solamente prima che inizi la fase di ritiro delle offerte.
        Prima di far aggiungere una nuova offerta devo anche contorllare che il deposito
        che viene inviato sia corretto.
        Un utente può fare più di una offerta (modificando la precedente) lasciando solamente
        una volta il deposito.
        
        Parametri:
        - Hash dell'offerta che vogliamo inviare (Nonce + valore denaro da inviare)
    */
    function addBid(bytes32 bid) public payable only_when_BidPhase() balanceAvailable(bidDeposit){
        require(msg.value == bidDeposit, "bidDeposit errato");
        
        // Se ho già fatto un'offerta restituisco il value inviato con questa transazione
        if(bids[msg.sender] == 0){
            bids[msg.sender] = bid;
        }
        else{
            bids[msg.sender] = bid;
            msg.sender.transfer(msg.value);
        }
    }
    
    
    /*
        Ritiro dell'offerta, viene restituito metà del bidDeposit.
        Questa funzione la posso chiamare solamente prima che finisca la fase di withdrawal e dopo
        che è finita quella di invio delle offerte. Inoltre si controlla che l'utente che
        chiede il rimborso abbia effettivamente inviato un'offerta.
        
        Parametri:
        - Hash dell'offerta che è stata precedentemente inviata
    */
    function withdrawal(bytes32 bid) public only_when_WithdrawalPhase{
        require(bid == bids[msg.sender], "Non puoi ritirare");
        
        delete bids[msg.sender];
        msg.sender.transfer(refundPrice);
    }
    
    
    /*
        Apertura delle buste con le offerte. Questa funzione la posso chiamare
        solamente dopo che sono finite le precedenti due fasi e prima che termini questa.
        Devo controllare che l'hash che ho inviato quando ho fatto l'offerta sia lo stesso che 
        calcolo qua usando il nonce e il valore che invio.
        Devo controllare anche che la mia offerta sia maggiore del reservePrice.
        Se ho fatto un'offerta minore del reservePrice perdo anche il deposito.
        Parametri:
        - Nonce usato quando abbiamo calcolato l'hash 
    */
    function openBid(uint _nonce) public payable only_when_openBid()  balanceAvailable(msg.value){
        require(keccak256(abi.encode(_nonce, msg.value)) == bids[msg.sender], "Impossibile aprire");
        
        // Indirizzo a cui va inviato il rimborso
        address payable toRefund;
        // rimborso da inviare
        uint val;
        
        
        // Caso in cui supero l'highest Bid, devo vedere anche se è la prima offerta
        // che lo supera o no, altrimenti rischio di azzerare il secondhighestBidder
        if(msg.value > highestBid) {
            // se è la prima offerta che supera l'highest Bidder non devo 
            // rimborsare nessuno perchè il secondhighestBidder è il valore del 
            // reservePrice
            if(highestBid == 0){
                highestBid = msg.value;
                highestBidder = msg.sender;
            }
            // se invece sono offerte successive allora devo fare un rimborso 
            else{
                toRefund = secondhighestBidder;
                val = secondHighestBid.add(bidDeposit);
                secondhighestBidder = highestBidder;
                secondHighestBid = highestBid;
                highestBid = msg.value;
                highestBidder = msg.sender;
            }
            
            emit HighestBidIncreased(msg.sender, secondhighestBidder);
        }
        // Caso in cui faccio un'offerta che supera solamente la seconda, in questo caso 
        // il precedente bidder viene rimborsato dell'offerta e del deposito.
        else if(msg.value > secondHighestBid){
            toRefund = secondhighestBidder;
            val = secondHighestBid.add(bidDeposit);
            secondhighestBidder = msg.sender;
            secondHighestBid = msg.value;
        }
        /* 
            La mia offerta non supera la prima o la seconda quindi dovrò essere
            rimborsato sia dell'offerta che del deposito. Qua ci finisco anche se l'offerta
            non supera il reservePrice perchè inizialmente il reservePrice è fissato come 
            seconda offerta più alta, quindi se non supero la seconda non supero nemmeno il reservePrice,
            questo serve quando ad esempio abbiamo tutte le offerte sotto al reservePrice e non vogliamo
            che la vendita avvenga comunque
        */
        else{
            toRefund = msg.sender;
            val = msg.value.add(bidDeposit);
        }
        
        // Eseguo il rimborso 
        if(toRefund != address(0)){
            toRefund.transfer(val);
        }
        
    }
    
    uint public balance;
   
    /*
        Funzione che chiude l'asta, viene chiamata solamente da chi ha creato 
        l'asta o da chi ha vinto, solamente quando le fasi precedenti sono terminate. Serve per segnare l'asta come chiusa e anche per
        fare il rimborso a chi ha vinto.
    */  
    function finalize() public payable only_when_openBidPhaseEnded() {
        require(msg.sender == highestBidder || msg.sender == auctioneer, "Non hai i permessi");
        
        emit AuctionEnded(highestBidder, secondHighestBid);
        ended = true;
        
        // Controlliamo che sia stata eseguita un'offerta valida.
        if(highestBidder != address(0)){
            highestBidder.transfer((highestBid.sub(secondHighestBid)).add(bidDeposit));
        }
        
        if(secondhighestBidder != address(0)){
            secondhighestBidder.transfer(secondHighestBid.add(bidDeposit));
        }
    
        balance = address(this).balance;
        // trasferisco il balance del contratto al creatore dell'asta 
        if(address(this).balance != 0){
            auctioneer.transfer(address(this).balance);
        }
    }
    
    
   
}
