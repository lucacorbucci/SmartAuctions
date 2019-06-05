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
    
    address public buyer;
    address payable public beneficiary;
    
    bool buyoutEnded = false;
    bool ended = false;
    
    
    constructor(uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks, address payable _beneficiary) public{
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice;
        minBlocks = _minBlocks;
        beneficiary = _beneficiary;
    }
    
    function acquistoDiretto() public payable{
        require(!buyoutEnded);
        require(!ended);
        
        if(msg.value == buyoutPrice){
            buyer = msg.sender;
            buyoutEnded = true;
            ended = true;
            beneficiary.transfer(buyoutPrice);
        }
        
        
    }
    
}
