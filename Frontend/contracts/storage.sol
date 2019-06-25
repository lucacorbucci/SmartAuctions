pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;
import "node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Storage{
    using SafeMath for uint;
    
    struct myContract {
        address owner;
        address contractAddress;
        uint counter;
        bool isActive;
        string url;
        string titolo;
        uint tipo;
        uint bloccoInizio;
        address winner;
    }

   
    
    mapping (address => myContract) contratti;
    address[] addContratti;

    uint counter;
    uint counterEnded;

    event newAuction(address contractAddress, uint tipo);
    event auctionEnded(address winner);
    
    function addContract(address creator, address contratto, string memory _url, string memory _titolo, uint tipo, uint bloccoInizio) public{
        contratti[contratto] = myContract(creator, contratto, counter, true, _url, _titolo, tipo, bloccoInizio, address(0));
        counter++;
        addContratti.push(contratto);
        emit newAuction(contratto, tipo);
    }
    
    function removeContract(address contr, address winner) public{
        require(contratti[contr].counter >= 0, "non esiste");
        contratti[contr].isActive = false;
        contratti[contr].winner = winner;
        counterEnded++;
        emit auctionEnded(winner);
    }
    
    function getAllContracts() public view returns(address[] memory, address[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory){
        uint lng = counter.sub(counterEnded);
        address[] memory add = new address[](lng);
        address[] memory con = new address[](lng);
        string[] memory urls = new string[](lng);
        string[] memory titles = new string[](lng);
        uint[] memory tipo = new uint[](lng);
        uint[] memory blocco = new uint[](lng);


        uint y = 0;
   
        for(uint i=0; i<counter; i++){
            myContract storage tmp = contratti[addContratti[i]];
            if(tmp.isActive){
                add[y] = tmp.owner;
                con[y] = tmp.contractAddress;
                urls[y] = tmp.url;
                titles[y] = tmp.titolo;
                tipo[y] = tmp.tipo;
                blocco[y] = tmp.bloccoInizio;
                y++;
            }
        }
        return(add, con, urls, titles, tipo, blocco);
        
    }

    function getEndedAuctions() public view returns(uint countere, address[] memory owners, string[] memory title, string[] memory url, uint[] memory tipo){

        if(counterEnded > 20){
            address[] memory owner = new address[](20);
            string[] memory titolo = new string[](20);
            string[] memory urlR = new string[](20);
            uint[] memory tipoR = new uint[](20);
            
            uint y = 0;
            for(uint i=counterEnded-1; y < 20; i--){
                myContract storage tmp = contratti[addContratti[i]];
                if(tmp.isActive == false){
                    owner[y] = tmp.owner;
                    titolo[y] = tmp.titolo;
                    urlR[y] = tmp.url;
                    tipoR[y] = tmp.tipo;
                    y++;
                }
            }
            return (counterEnded, owner, titolo, urlR, tipoR);
        }
        else{
            address[] memory owner = new address[](counterEnded);
            string[] memory titolo = new string[](counterEnded);
            string[] memory urlR = new string[](counterEnded);
            uint[] memory tipoR = new uint[](counterEnded);

            uint y = 0;
            for(uint i=0; i<counter; i++){
                myContract storage tmp = contratti[addContratti[i]];
                if(tmp.isActive == false){
                    owner[y] = tmp.owner;
                    titolo[y] = tmp.titolo;
                    urlR[y] = tmp.url;
                    tipoR[y] = tmp.tipo;
                    y++;
                }
                
            }
            return (counterEnded, owner, titolo, urlR, tipoR);
        }
    }
    
    
}
