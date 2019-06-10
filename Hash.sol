pragma solidity ^0.5.1;


contract Hash {
    
    function generateHash(bytes32 nonce, uint256 value) public pure returns (bytes32){
        return keccak256(abi.encode(nonce, value));
    }
    
}
