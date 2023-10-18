const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Interactions', () => {
    async function deployFixture() {
        const [deployer, user, attacker] = await ethers.getSigners()

        const Lottery = await ethers.getContractFactory("Lottery")
        const lottery = await Lottery.deploy()
        lottery.deployed()

        const LotteryAttacker = await ethers.getContractFactory("LotteryAttacker")
        const lotteryAttacker = await LotteryAttacker.deploy(lottery.address)
        lotteryAttacker.deployed()

        return {lottery, lotteryAttacker, deployer, user, attacker}
    }

    it("should give me a random number", async () => {
        const {lottery} = await deployFixture()
        const rand = await lottery.pseudoRandNumGen()
        console.log("random number: ", rand)
    })
    it.skip("A miner could tamper the result", async () => {
        const {lottery, user, attacker} = await deployFixture()
        await lottery.connect(attacker).placeBet(5, {value: ethers.utils.parseEther("10")})
        await lottery.connect(user).placeBet(150, {value: ethers.utils.parseEther("10")})
        await lottery.placeBet(73, {value: ethers.utils.parseEther("10")})

        let winningNumber = 0;

        while(winningNumber != 5){
            await lottery.endLottery()
            winningNumber = await lottery.winningNumber()
            console.log(winningNumber)
        }
        console.log(await ethers.provider.getBlock("latest"))
    })
    it("replicate random logic within the same block", async function() {
        const {lottery, lotteryAttacker} = await deployFixture()
        // const winning = await lottery.winningNumber()
        await lotteryAttacker.attack({value: ethers.utils.parseEther("11")})
        await lottery.endLottery()
        await ethers.provider.send("evm_mine")

        console.log('attacker number:', await lottery.bets(lotteryAttacker.address))
        console.log('winning number: ', await lottery.winningNumber())
        expect(await lotteryAttacker.victim()).to.equal(lottery.address)
    })
})
