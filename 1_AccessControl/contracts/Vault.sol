// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault is Ownable{
    bytes32 private password;

    constructor(bytes32 _password) {
        password = _password;
    }

    modifier checkPassword(bytes32 _password) {
        require(password == _password, "password does not match!!");
        _;
    }

    function deposit() external payable{}

    function withdraw(bytes32 _password) external checkPassword(_password) {
        payable(msg.sender).transfer(address(this).balance);
    }
}

