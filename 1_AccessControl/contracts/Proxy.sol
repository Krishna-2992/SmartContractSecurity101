// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;    

contract Proxy {
    uint public x;
    address public owner;
    address public logicContract;

    constructor(address _logic) {
        logicContract = _logic;
        owner = msg.sender;
    }

    function upgrade(address _newLogicContract) external {
        require(msg.sender == owner, "Access restricted!!");
        logicContract = _newLogicContract;
    }

    fallback() external payable {
        (bool success, ) = logicContract.delegatecall(msg.data);
        require(success, "unexpected error!!");
    }
    receive() external payable{}
}