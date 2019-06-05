pragma solidity >=0.4.22;

contract englishAuction(){
    
    // Offerta minima che deve essere fatta
    uint public reservePrice;
    // Incremento minimo rispetto ad una precedente Offerta
    uint public minIcrement;
    // Prezzo per l'acquisto diretto senza asta
    uint public buyoutPrice;
    // Numero di blocchi che devono passare prima di terminare l'asta
    uint public minBlocks;
    
    constructor(uint _reservePrice, uint _minIcrement, uint _buyoutPrice, uint _minBlocks) public{
        reservePrice = _reservePrice;
        minIcrement = _minIcrement;
        buyoutPrice = _buyoutPrice;
        minBlocks = _minBlocks;
    }
    
}
