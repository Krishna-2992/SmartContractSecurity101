const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Interactions', () => {
    async function deployFixture() {
        const [deployer, user, attackerAdd] = await ethers.getSigners()

        const SmallWallet = await ethers.getContractFactory('SmallWallet')
        const smallWallet = await SmallWallet.deploy()
        smallWallet.deployed()
        // console.log('balance before:: ', await ethers.provider.getBalance(smallWallet.address))
        await deployer.sendTransaction({to: smallWallet.address, value: 10000})
        // console.log('balance after:: ', await ethers.provider.getBalance(smallWallet.address))

        const Attacker = await ethers.getContractFactory('Attacker')
        const attacker = await Attacker.connect(attackerAdd).deploy(smallWallet.address)
        attacker.deployed()

        return { smallWallet, attacker, deployer, user, attackerAdd }
    }

    describe("SmallWallet", () => {
        it("should receive deposits", async () => {
            const {smallWallet} = await deployFixture()
            expect(await ethers.provider.getBalance(smallWallet.address)).to.equal(10000);
        })
        it("Should allow the owner to execute withdrawAll", async () => {
            const {smallWallet, user} = await deployFixture()
            await smallWallet.withdrawAll(user.address);
            expect(await ethers.provider.getBalance(smallWallet.address)).to.equal(0);
        })
        it("Should revert if withdraw is called from any other account than owner", async () => {
            const {smallWallet, user} = await deployFixture()
            await expect(smallWallet.connect(user).withdrawAll(user.address)).to.be.revertedWith("caller not authorized!!")
        })
    })
    
    describe("Attack", ()=> {
        it("should draing all the smallWallet funds if deployer sends in attacker contract",async () => {
            const {smallWallet, attacker, deployer, attackerAdd} = await deployFixture()
            const initialBalance = await ethers.provider.getBalance(attackerAdd.address)
            await deployer.sendTransaction({to: attacker.address, value: 1})

            expect(await ethers.provider.getBalance(smallWallet.address)).to.equal(0)
            expect(await ethers.provider.getBalance(attackerAdd.address)).to.eq(initialBalance.add(10000))
        })
    })
})
