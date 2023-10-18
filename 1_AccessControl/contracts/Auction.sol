// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is Ownable, ReentrancyGuard {
    using Address for address payable;

    address payable public currentLeader;
    uint public highestBid;

    struct Refund{
        address payable addr;
        uint amount;
    }
    Refund[] public refunds;

    function bid() public payable nonReentrant {
        require(msg.value > highestBid, "bid not high enough");
        
        if(currentLeader!=address(0)){
            refunds.push(Refund(currentLeader, highestBid));
        }
        currentLeader = payable(msg.sender);
        highestBid = msg.value;
    }

    function refundAll() external onlyOwner nonReentrant {
        for(uint i=0; i < refunds.length; i++) {
            refunds[i].addr.transfer(refunds[i].amount);
        }
        delete refunds;
    }
} 