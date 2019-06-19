pragma solidity ^0.5.1;

contract Storage{
    
    struct myContract {
        address owner;
        address contractAddress;
        uint counter;
    }
    
    mapping (address => myContract) contratti;
    address[] addContratti;
    uint counter;
    
    function addContract(address creator, address contratto) public{
        contratti[contratto] = myContract(creator, contratto, counter);
        counter++;
        addContratti.push(contratto);
    } 
    
    function removeContract(address contr) public{
        require(contratti[contr].counter >= 0, "non esiste");
        uint index = contratti[contr].counter;
        delete(contratti[contr]);
        delete(addContratti[index]);
        counter--;
    }
    
    function getAllContracts() public view returns(address[] memory, address[] memory){
        address[] memory add = new address[](counter);
        address[] memory con = new address[](counter);
   
        for(uint i=0; i<counter; i++){
            myContract storage tmp = contratti[addContratti[i]];
            add[i] = tmp.owner;
            con[i] = tmp.contractAddress;
        }
        return(add, con);
        
    }
    
}
