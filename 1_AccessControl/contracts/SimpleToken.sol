// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleToken is Ownable {
    mapping (address => uint256) public balanceOf;
    uint256 public totalSupply;

    constructor(uint _initialSupply) {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    function transfer(address _to, uint _amount) external {
        require(balanceOf[msg.sender] - _amount >= 0, "Not enough tokens!!");
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;
    }

}