pragma solidity ^0.5.1;
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/math/SafeMath.sol";

contract englishAuction {
    using SafeMath for uint;
    
    // Offerta minima che deve essere fatta
    uint public reservePrice;
    
    uint public minIcrement;
    // Prezzo per l'acquisto diretto senza asta
    uint public buyoutPrice;
    
    // Numero di blocchi che devono passare prima di terminare l'asta
    uint public minBlocks;
    
    // Indirizzo che ha fatto l'offerta più alta e offerta più alta ricevuta
    uint public highestBid;
    address payable public highestBidder;
    
    // Indirizzo che ha comprato direttamente senza asta
    address public buyer;
    // Creatore dell'asta
    address payable auctioneer;
    
    // Booleano usato per capire se l'asta è terminata o no
    bool ended = false;
    // booleano per capire se è stato fatto l'acquisto diretto senza asta
    bool buyoutEnded = false;
    
    // usato per capire se l'asta è iniziata
    bool started = false;
    
    // Blocco in cui è stata eseguita l'ultima offerta
    uint startingBlock;
    
    // Quattro eventi, uno per dire che ho aumentato l'offerta e uno per indicare che l'asta è terminata
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event Refunded(address refundedAddress, uint amount);
    event NoBid();
    
    string title;
    string URL;
    
    constructor(string memory _title, string memory _URL, uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks) public payable{
        require(_reservePrice > 0, "reserve > 0");
        require(_buyoutPrice > 0, "buyoutPrice > 0");
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice * 1 wei;
        minBlocks = _minBlocks;
        auctioneer = msg.sender;
        title = _title;
        URL = _URL;
    }
    
    // Controllo che l'asta non sia terminata
    modifier only_notEnded(){
        require(!ended, "Asta terminata"); _;
    }
    
    // Controllo che sia ancora possibile acquistare il prodotto
    // direttamente e senza fare l'asta
    modifier buyout_available(){
        require(buyoutEnded == false, "Non acquistabile direttamente"); _;
    }
    
    // Controllo che tra l'ultima offerta e quella che provo a fare
    // non siano passati troppi blocchi
    modifier bidAvailable(){
        require(startingBlock < startingBlock.add(minBlocks), "Impossibile fare altre offerte"); _;
    }
    
    // Controlla che chi fa l'offerta abbia a disposizione un balance maggiore di 
    // quanto offre
    modifier balanceAvailable(uint price){
        require(msg.sender.balance >= price, "Balance non sufficiente"); _;
    }
    
    /*
        Controlla che il chiamante della funzione sia il creatore del contratto
        oppure quello che ha vinto l'asta.
    */
    modifier onlyAuthorized() {
         require(msg.sender == auctioneer || msg.sender == highestBidder, "Non vincitore o auctioneer");
        _;
    }
    
    modifier only_when_FinalizePhase(){
        require(startingBlock.add(minBlocks) < uint(block.number), "Blocco non sufficiente");
        _;
    }
    
    // Controlla che la funzione sia stata chiamata dal creatore dell'asta
    modifier only_auctioneer(){
        require(msg.sender == auctioneer, "non sei l'auctioneer"); _;
    }
    
     // Controllo che l'asta sia stata avviata
    modifier only_when_started(){
        require(started, "Asta non iniziata"); _;
    }
    
    
    /*
        Inizio dell'asta, solamente il creatore dell'asta può avviarla
    */
    function openAuction() public only_auctioneer(){
        require(started == false);
        started = true;
        
    }
    

    /*
        Funzione che permette di acquistare direttamente il prodotto senza 
        dover svolgere l'asta pagando il buyoutPrice.
        Può essere chiamata solamente se:
        - l'asta non è terminata
        - è ancora disponibile la possibilità di acquistare direttamente
        - ho un balance sufficiente per acquistare
        - Il valore di buyout è uguale a quello che invio
        
        Alla fine il valore che invio viene trasferito al creatore dell'asta.
    */
    function acquistoDiretto() public payable only_notEnded() buyout_available() balanceAvailable(buyoutPrice) only_when_started(){
        
        require(msg.value == buyoutPrice, "Valore differente");
        
        emit AuctionEnded(msg.sender, msg.value);
        ended = true;
        buyer = msg.sender;
        auctioneer.transfer(buyoutPrice);
        
    }
    
    /*
        Funzione che permette di eseguire un'offerta.
        Viene eseguita se:
        - l'asta non è già terminata
        - chi invia l'offerta ha un balance maggiore di quello che offre
        - Se tra il bid precedente e il successivo non sono passati troppi blocchi
    */
    function bid() public payable only_notEnded() balanceAvailable(msg.value) only_when_started(){
        
        // Prima offerta che arriva, in questo caso posso fare un'offerta pari al minimo
        // e non devo controllare che sia terminata la fase di bid
        if(buyoutEnded == false){
           
            require(msg.value >= reservePrice);
            buyoutEnded = true;
        }
        else{
            // offerte successive alla prima, in questo caso devo fare un'offerta maggiore della precedente più il minimo incremento
            // una volta ricevuta l'offerta devo anche restituire i soldi al precedente bidder
            require(block.number <= startingBlock.add(minBlocks), "Impossibile fare altre offerte");
            require(msg.value >= highestBid.add(minIcrement), "Incremento non sufficiente");
        }
        
        uint value = highestBid;
        address payable receiver = highestBidder;
        
        highestBid = msg.value;
        highestBidder = msg.sender;
        startingBlock = uint(block.number);
        emit HighestBidIncreased(highestBidder, highestBid);
        
        // Serve l'if perchè alla prima offerta che ricevo non devo restituire soldi
        if(value != 0 && receiver != address(0)){
            receiver.transfer(value);
        }
        
    }
    
    
    /*
        Funzione che può essere chiamata solamente se:
        - l'asta non è già terminata
        - solo dal vincitore o da chi ha creato l'asta
        - solamente dopo che non posso fare altre offerte
        Qua trasferisco i soldi che sono stati offerti al creatore del contratto e 
        termino l'asta emettendo anche un evento.
    */
    function finalize() external payable only_notEnded() onlyAuthorized() only_when_FinalizePhase() only_when_started(){
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        auctioneer.transfer(highestBid);
        
    }

}
