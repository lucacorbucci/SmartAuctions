pragma solidity ^0.5.1;


contract Vickrey {
    
    // Prezzo minimo dell'asta
    uint reservePrice;
    // Deposito minimo
    uint public bidDeposit;
    // Prezzo che viene restituito in caso di ritiro
    uint refundPrice;
    // Creatore dell'asta
    address auctioneer;
    
    uint bidTimeStart;
    uint bidTime;
    
    uint withdrawalTimeStart;
    uint withdrawalTime;
    
    uint bidOpeningTimeStart;
    uint bidOpeningTime;
    
    uint highestBid;
    uint secondHighestBid;
    
    address payable highestBidder;
    address payable secondhighestBidder;
    
    // Memorizzo la coppia (indirizzo, hash offerta)
    mapping (address => bytes32) bids;
    
    bool started = false;
    bool ended = false;
    
    constructor(uint _reservePrice, uint _bidTime, uint _withdrawalTime, uint _bidOpeningTime, uint _bidDeposit) public payable{
        require(_reservePrice > 0, "reserve > 0");
        reservePrice = _reservePrice;
        auctioneer = msg.sender;
        bidTime = _bidTime;
        withdrawalTime = _withdrawalTime;
        bidOpeningTime = _bidOpeningTime;
        bidDeposit = _bidDeposit;
        refundPrice = _bidDeposit / 2;
        secondHighestBid = reservePrice;
    }
    
    modifier only_when_bidPhaseEnded(){
        require(block.number > bidTimeStart + bidTime, "bid Phase non termianta"); _;
    }
    
    modifier only_when_withdrawalPhaseEnded(){
        require(block.number > bidTimeStart + bidTime + withdrawalTime, "withdrawal Phase non terminata"); _;
    }
    
    modifier only_when_openBidPhaseEnded(){
        require(block.number > bidTimeStart + bidTime + withdrawalTime + bidOpeningTime, "Open BidPhase non terminata"); _;
    }
    
    modifier only_when_auctionStarted(){
        require(started == true, "asta non iniziata"); _;
    }
    
    /*
        Inizio dell'asta, solamente il creatore dell'asta può avviarla
    */
    function openAuction() public{
        require(msg.sender == auctioneer, "non sei l'auctioneer");
        require(started == false);
        started = true;
        bidTimeStart = block.number;
    }
    
    /*
        Aggiunta di una nuova offerta
    */
    function addBid(bytes32 bid) public payable only_when_auctionStarted(){
        require(block.number <= bidTimeStart + bidTime, "Bid Phase ended");
        require(msg.value == bidDeposit, "bidDeposit errato");
        if(bids[msg.sender] == 0){
            bids[msg.sender] = bid;
        }
        else{
            bids[msg.sender] = bid;
            msg.sender.transfer(msg.value);
        }
    }
    
    /*
        Ritoro dell'offerta, viene restituito metà del bidDeposit
    */
    function withdrawal(bytes32 bid) public only_when_bidPhaseEnded() only_when_auctionStarted(){
        
        require(bid == bids[msg.sender], "Non puoi ritirare");
        delete bids[msg.sender];
        msg.sender.transfer(refundPrice);
    }
    
    function openBid(uint _nonce) public payable only_when_withdrawalPhaseEnded() only_when_auctionStarted(){
        require(keccak256(abi.encode(_nonce, msg.value)) == bids[msg.sender], "Impossibile aprire");
        require(msg.value >= reservePrice, "offerta < reservePrice");
        address payable toRefund;
        uint val;
        if(msg.value > highestBid){
            toRefund = secondhighestBidder;
            val = secondHighestBid + bidDeposit;
            secondhighestBidder = highestBidder;
            secondHighestBid = highestBid;
            highestBid = msg.value;
            highestBidder = msg.sender;
        }
        else if(msg.value > secondHighestBid){
            toRefund = secondhighestBidder;
            val = secondHighestBid + bidDeposit;
            secondhighestBidder = msg.sender;
            secondHighestBid = msg.value;
        }
        else{
            toRefund = msg.sender;
            val = msg.value + bidDeposit;
        }
        
        
        if(toRefund != address(0)){
            toRefund.transfer(val);
        }
        
    }
    
   
    /*
        Funzione che chiude l'asta, viene chiamata solamente da chi ha creato 
        l'asta o da chi ha vinto. Serve per segnare l'asta come chiusa e anche per
        fare il rimborso a chi ha vinto.
    */
    function finalize() public payable only_when_openBidPhaseEnded only_when_auctionStarted(){
        
        require(msg.sender == highestBidder || msg.sender == auctioneer, "Non hai i permessi");
        
        ended = true;
        if(highestBidder != address(0)){
            highestBidder.transfer(highestBid - secondHighestBid);
        }
        
    }
    
    
   
}
