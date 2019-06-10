pragma solidity ^0.5.1;


contract Vickrey {
    
    // Prezzo minimo della cauzione
    uint reservePrice;
    // Prezzo che viene restituito in caso di ritiro
    uint refundPrice;
    // Creatore dell'asta
    address auctioneer;
    
    uint bidTime;
    uint withdrawalTime;
    uint bidOpeningTime;
    
    uint highestBid;
    uint secondHighestBid;
    
    address payable highestBidder;
    address payable secondhighestBidder;
    
    // Memorizzo la coppia (indirizzo, hash offerta)
    mapping (address => bytes32) bids;
    
    constructor(uint _reservePrice, uint _bidTime, uint _withdrawalTime, uint _bidOpeningTime) public{
        require(_reservePrice > 0, "reserve > 0");
        reservePrice = _reservePrice;
        refundPrice = _reservePrice / 2;
        auctioneer = msg.sender;
        bidTime = _bidTime;
        withdrawalTime = _withdrawalTime;
        bidOpeningTime = _bidOpeningTime;
    }
    
    function addBid(bytes32 bid) public payable{
        require(msg.value == reservePrice, "reservePrice errato");
        bids[msg.sender] = bid;
    }
    
    function withdrawal(bytes32 bid) public{
        require(bid == bids[msg.sender], "Non puoi ritirare");
        delete bids[msg.sender];
        msg.sender.transfer(refundPrice);
    }
    
    function openBid(uint _nonce) public payable{
        require(keccak256(abi.encode(_nonce, msg.value)) == bids[msg.sender], "Impossibile aprire");
        address payable toRefund;
        uint val;
        if(msg.value > highestBid){
            toRefund = secondhighestBidder;
            val = secondHighestBid + reservePrice;
            secondhighestBidder = highestBidder;
            secondHighestBid = highestBid;
            highestBid = msg.value;
            highestBidder = msg.sender;
            
        }
        else if(msg.value > secondHighestBid){
            toRefund = secondhighestBidder;
            val = secondHighestBid + reservePrice;
            secondhighestBidder = msg.sender;
            secondHighestBid = msg.value;
        }
        else{
            toRefund = msg.sender;
            val = msg.value + reservePrice;
        }
        
        toRefund.transfer(val);
        
    }
    
    function finalize() public payable{
        highestBidder.transfer(highestBid - secondHighestBid);
    }
    
    
    /*
    bytes32 public hash;
    bytes32 public nonce;
    uint256 public testVal;
    bytes public abia;
    bytes32 public TestHashVar;
    bytes public t;
    
    function testhash(bytes32 _nonce, bytes memory _t) public payable{
        t = _t;
        nonce = _nonce;
        testVal = msg.value;
        abia = abi.encode(_nonce, msg.value);
        TestHashVar = keccak256(_t);
        hash = keccak256(abi.encode(_nonce, msg.value));
        //require(keccak256(abi.encode(_nonce, msg.value)) == bids[msg.sender], "Impossibile aprire");
        
    }
    
    */
    
   
}
