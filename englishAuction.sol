pragma solidity >=0.4.22;

contract englishAuction {
    
    // Offerta minima che deve essere fatta
    uint public reservePrice;
    // Incremento minimo rispetto ad una precedente Offerta
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
    address payable beneficiary;
    
    // Booleano usato per capire se l'asta è terminata o no
    bool ended = false;
    // booleano per capire se è stato fatto l'acquisto diretto senza asta
    bool buyoutEnded = false;
    
    // Blocco in cui è stata eseguita l'ultima offerta
    uint startingBlock;
    
    // Due eventi, uno per dire che ho aumentato l'offerta e uno per indicare che l'asta è terminata
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    event Refunded(address refundedAddress, uint amount);
    event NoBid();
    
    
    
    constructor(uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks, address payable _beneficiary) public payable{
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice * 1 wei;
        minBlocks = _minBlocks;
        beneficiary = _beneficiary;
        startingBlock = uint(block.number);
        highestBid = 0;
        highestBidder = address(0);
    }
    
    
    
    function acquistoDiretto() public payable{
        require(!ended, "Asta terminata");
        require(buyoutEnded == false, "Non acquistabile direttamente");
        //require(msg.sender.balance < buyoutPrice, "Balance non sufficiente");
        require(msg.value == buyoutPrice, "diversi");
        
        emit AuctionEnded(msg.sender, msg.value);
        ended = true;
        
        beneficiary.transfer(buyoutPrice);
        
    }
    
    
    
    
    function bid() public payable{
        require(!ended, "Asta Terminata");
        require(msg.sender.balance > msg.value, "Balance non sufficiente");

        if(buyoutEnded == false){
            // Prima offerta che arriva, in questo caso posso fare un'offerta pari al minimo
            require(msg.value >= reservePrice);
            buyoutEnded = true;
        }
        else{
            // offerte successive alla prima, in questo caso devo fare un'offerta maggiore della precedente del minimo incremento
            // una volta ricevuta l'offerta devo anche restituire i soldi al precedente bidder
            require(startingBlock + minBlocks > uint(block.number), "Impossibile fare nuove offerte");
            require(msg.value >= highestBid + minIcrement, "Incremento non sufficiente");
        }
        
        uint value = highestBid;
        address payable receiver = highestBidder;
        
        highestBid = msg.value;
        highestBidder = msg.sender;
        startingBlock = uint(block.number);
        emit HighestBidIncreased(highestBidder, highestBid);
        
        if(value != 0 && receiver != address(0)){
            emit Refunded(receiver, value);
            receiver.transfer(value);
        }
        
    }
    
    
    
    function finalize() public payable{
        require(ended == false, "asta terminata");
        require(msg.sender == highestBidder || msg.sender == beneficiary, "Non vincitore o beneficiary");
        require(startingBlock + minBlocks < uint(block.number), "Blocco non sufficiente");
        
        if(highestBid == 0){
            ended = true;
            emit NoBid();
        }
        else{
            ended = true;
            emit AuctionEnded(highestBidder, highestBid);
            beneficiary.transfer(highestBid);
        }
    }
    
}
