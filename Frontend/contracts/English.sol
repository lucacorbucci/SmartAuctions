pragma solidity ^0.5.1;
import "node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
pragma experimental ABIEncoderV2;

contract StorageInterface{
    
    function addContract(address creator, address contratto, string memory _url, string memory _titolo, uint tipo, uint bloccoInizio) public;
    
    function removeContract(address contrAddress, address winner) public;
    
    function getAllContracts() public view returns(address[] memory, address[] memory);
    
}




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
    uint public highestBid=0;
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
    // blocco in cui creo l'asta
    uint auctionStart;
    // Due eventi, uno per dire che ho aumentato l'offerta e uno 
    // per indicare che l'asta è terminata
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    
    // titolo dell'asta e url di una foto del prodotto che voglio vendere
    string title;
    string URL;

    // numero di blocchi che devono passare prima di iniziare l'asta
    uint numBlockStart;
    
    /*
        Parametri:
        - _title: nome del prodotto che vogliamo mettere in vendita
        - _URL: url di una immagine del prodotto che vogliamo vendere
        - _reservePrice: prezzo base dell'asta 
        - _minIcrement: incremento minimo che deve esserci tra un'offerta e l'altra
        - _buyoutPrice: prezzo per l'acquisto diretto 
        - _minBlocks: numero minimo di blocchi che devono passare prima di decretare il vincitore dell'asta
    */
    constructor(string memory _title, string memory _URL, uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks, uint _numBlockStart) public payable{
        require(_reservePrice > 0);
        require(_buyoutPrice > 0);
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice * 1 wei;
        minBlocks = _minBlocks;
        auctioneer = msg.sender;
        title = _title;
        URL = _URL;
        numBlockStart = _numBlockStart;
        auctionStart = block.number;
        require(addToStorage(msg.sender, address(this)));
    }
    
    function addToStorage(address sender, address contractAddress) public returns(bool success){
        StorageInterface s = StorageInterface(0x26Ff8ba7f78C226753B8c463c4Bfea37e53AB8fC);
        s.addContract(sender, contractAddress, URL, title, 0, auctionStart.add(numBlockStart));
        return true;
    }

    function removeFromStorage() public returns(bool success){
        StorageInterface s = StorageInterface(0x26Ff8ba7f78C226753B8c463c4Bfea37e53AB8fC);
        s.removeContract(address(this), address(highestBidder));
        return true;
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
        require(startingBlock < startingBlock.add(minBlocks), "Bid Phase terminata"); _;
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
         require(msg.sender == auctioneer || msg.sender == highestBidder, "Non autorizzato"); _;
    }
    
    modifier only_when_FinalizePhase(){
        require(startingBlock.add(minBlocks) < uint(block.number), "Asta non terminata"); _;
    }
    
    // Controlla che la funzione sia stata chiamata dal creatore dell'asta
    modifier only_auctioneer(){
        require(msg.sender == auctioneer, "Non sei l'auctioneer"); _;
    }
    
     // Controllo che l'asta sia stata avviata
    modifier only_when_started(){
        require(auctionStart.add(numBlockStart) <= block.number, "Asta non avviata"); _;
    }
    
    
    /*
        Inizio dell'asta, solamente il creatore dell'asta può avviarla
    function openAuction() public only_auctioneer(){
        require(started == false);
        started = true;
    
    }
    */
    

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
        
        require(msg.value == buyoutPrice);
        
        emit AuctionEnded(msg.sender, msg.value);
        ended = true;
        buyer = msg.sender;
        require(removeFromStorage());
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
            require(block.number <= startingBlock.add(minBlocks));
            require(msg.value >= highestBid.add(minIcrement));
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
        require(removeFromStorage());
        auctioneer.transfer(highestBid);
    }
    
    /*
        Funzione che restituisce l'address che ha fatto l'offerta più alta
    */
    function getHighestBidder() public view returns(address){
        return highestBidder;
    }
    
    /*
        Funzione che restituisce l'offerta più alta
    */
    function getHighestBid() public view returns(uint){
        return highestBid;
    }
    
    /*
        Funzione che restituisce il prezzo dell'acquisto diretto
    */ 
    function getBuyoutPrice() public view returns(uint){
        return buyoutPrice;
    }
    
    /*
        Funzione che restituisce l'incremento minimo da fare rispetto all'offerta più alta
    */
    function getMinIncrement() public view returns(uint){
        return minIcrement;
    }

    function getAllData() public view returns(uint, uint, uint, uint, bool, bool, uint, uint, uint, uint, address, string memory){
        
        return (minIcrement, highestBid, buyoutPrice, reservePrice, ended, buyoutEnded, auctionStart, numBlockStart, startingBlock, minBlocks, highestBidder, title);
    }


    
}