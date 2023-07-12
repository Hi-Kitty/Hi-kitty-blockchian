// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DonationContract {

    address internal owner;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "Only owner can call function");
        _;
    }

    struct Trade {
        string donorName;
        string fundraiserName;
        string timestamp;
        uint amount;
    }
    
    mapping (string => Trade[]) public map_trade;
    
    function addTransaction(
        string memory _key,
        string memory _donorName,
        string memory _fundraiserName,
        string memory _timestamp,
        uint _amount
    ) public onlyOwner {
        Trade memory newTransaction = Trade({
            donorName: _donorName,
            fundraiserName: _fundraiserName,
            timestamp: _timestamp,
            amount: _amount
        });
        map_trade[_key].push(newTransaction);
    }
    
    function view_map(string memory _key) public view returns (
       Trade[] memory
    ) {
       return map_trade[_key];
    }
   
}