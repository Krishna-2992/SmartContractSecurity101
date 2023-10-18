// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AuctionV2 is Ownable, ReentrancyGuard {
    using Address for address payable;

    address payable public currentLeader;
    uint public highestBid;

    mapping (address => uint) refunds;

    function bid() public payable nonReentrant {
        require(msg.value > highestBid, "bid not high enough");
        
        if(currentLeader!=address(0)){
            refunds[currentLeader] += msg.value;
        }
        currentLeader = payable(msg.sender);
        highestBid = msg.value;
    }

    function withdrawRefunds() external onlyOwner nonReentrant {
        uint refund = refunds[msg.sender];
        refunds[msg.sender] = 0;

        payable(msg.sender).sendValue(refund);
    }
} 