// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SavingsAccount {
    mapping (address => uint) public balanceOf;    

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint amountDeposited = balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        payable(msg.sender).transfer(amountDeposited);
    }
}