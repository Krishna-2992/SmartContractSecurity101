// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AgreedPrice is Ownable {
    uint public price;

    constructor(uint _price) {
        price = _price;
    }

    function updatePrice(uint _price) external onlyOwner {
        price = _price;
    }
}