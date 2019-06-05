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
    
    uint public highestBid;
    address public highestBidder;
    
    address public buyer;
    address payable public beneficiary;
    
    bool buyoutEnded = false;
    bool ended = false;
    
    uint public val = 0;
    
    uint startingBlock;
    
    
    constructor(uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks, address payable _beneficiary) public payable{
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice * 1 wei;
        minBlocks = _minBlocks;
        beneficiary = _beneficiary;
        startingBlock = uint(block.number);
    }
    
    function acquistoDiretto() public payable{
        require(!buyoutEnded, "fine buyout");
        require(!ended, "fine asta");
        require(msg.value == buyoutPrice, "diversi");
            
        buyer = msg.sender;
        buyoutEnded = true;
        ended = true;
        beneficiary.transfer(buyoutPrice);
        
    }
    
    
    function bid() public payable{
        require(!ended, "fine asta");
        require(msg.value > reservePrice);
        require(msg.value > highestBid + minIcrement);
        
        if(startingBlock + minBlocks > uint(block.number)){
            ended = true;
        }
        else{
            highestBid = msg.value;
            highestBidder = msg.sender;
            if(!buyoutEnded){
                buyoutEnded = true;
            }
        }
    }
    
}
