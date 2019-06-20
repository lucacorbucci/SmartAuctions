pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;

contract Storage{
    
    struct myContract {
        address owner;
        address contractAddress;
        uint counter;
        bool isActive;
        string url;
        string titolo;
        uint tipo;
    }
    
    mapping (address => myContract) contratti;
    address[] addContratti;
    uint counter;
    
    function addContract(address creator, address contratto, string memory _url, string memory _titolo, uint tipo) public{
        contratti[contratto] = myContract(creator, contratto, counter, true, _url, _titolo, tipo);
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
    
    function getAllContracts() public view returns(address[] memory, address[] memory, string[] memory, string[] memory){
        address[] memory add = new address[](counter);
        address[] memory con = new address[](counter);
        string[] memory urls = new string[](counter);
        string[] memory titles = new string[](counter);
   
        for(uint i=0; i<counter; i++){
            myContract storage tmp = contratti[addContratti[i]];
            add[i] = tmp.owner;
            con[i] = tmp.contractAddress;
            urls[i] = tmp.url;
            titles[i] = tmp.titolo;
        }
        return(add, con, urls, titles);
        
    }
    
    
    
}
