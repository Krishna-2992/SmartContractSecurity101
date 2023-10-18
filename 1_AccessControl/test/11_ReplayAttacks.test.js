const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Interactions', () => {
    async function deployFixture() {
        const [deployer, admin1, admin2, user, attacker] = await ethers.getSigners()

        const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
        const multiSigWallet = await MultiSigWallet.deploy([admin1.address, admin2.address])
        multiSigWallet.deployed()

        await deployer.sendTransaction({to: multiSigWallet.address, value: ethers.utils.parseEther("10")})

        return {multiSigWallet, deployer, admin1, admin2, user, attacker} 
    }

    it("should transfer funds after receiving the ethers: ", async () => {
        const {multiSigWallet, deployer, admin1, admin2, user, attacker} = await deployFixture()
        const before = await ethers.provider.getBalance(user.address)
        
        const amount = ethers.utils.parseEther("1")
        const walletBalance = await ethers.provider.getBalance(multiSigWallet.address)

        const message = ethers.utils.solidityPack(["address", "uint256"], [user.address, amount])
        const messageBuffer = ethers.utils.concat([message])

        let adminOneSig = await admin1.signMessage(messageBuffer)
        let adminTwoSig = await admin2.signMessage(messageBuffer)

        let adminOneSplitSignature = ethers.utils.splitSignature(adminOneSig)
        let adminTwoSplitSignature = ethers.utils.splitSignature(adminTwoSig)

        await multiSigWallet.transfer(user.address, amount, [adminOneSplitSignature, adminTwoSplitSignature])

        const after = await ethers.provider.getBalance(user.address)

        expect(after).to.equal(before.add(ethers.utils.parseEther("1")))
    })
    it("should revert if transaction is signed by attacker", async () => {
        const {multiSigWallet, deployer, admin1, admin2, user, attacker} = await deployFixture()
        const before = await ethers.provider.getBalance(user.address)
        
        const amount = ethers.utils.parseEther("1")

        const message = ethers.utils.solidityPack(["address", "uint256"], [user.address, amount])
        const messageBuffer = ethers.utils.concat([message])

        let adminOneSig = await attacker.signMessage(messageBuffer)
        let adminTwoSig = await admin2.signMessage(messageBuffer)

        let adminOneSplitSignature = ethers.utils.splitSignature(adminOneSig)
        let adminTwoSplitSignature = ethers.utils.splitSignature(adminTwoSig)
        
        await expect(multiSigWallet.transfer(user.address, amount, [adminOneSplitSignature, adminTwoSplitSignature])).to.be.revertedWith("Access restricted")
    })
    it("should be able to send the transactions twice with the same signatures", async ()=> {
        const {multiSigWallet, deployer, admin1, admin2, user, attacker} = await deployFixture()
        const before = await ethers.provider.getBalance(user.address)
        
        const amount = ethers.utils.parseEther("1")
        const walletBalance = await ethers.provider.getBalance(multiSigWallet.address)

        console.log('wallet balance: ', walletBalance)
        console.log('user balance: ', before)

        const message = ethers.utils.solidityPack(["address", "uint256"], [user.address, amount])
        const messageBuffer = ethers.utils.concat([message])

        let adminOneSig = await admin1.signMessage(messageBuffer)
        let adminTwoSig = await admin2.signMessage(messageBuffer)

        let adminOneSplitSignature = ethers.utils.splitSignature(adminOneSig)
        let adminTwoSplitSignature = ethers.utils.splitSignature(adminTwoSig)

        await multiSigWallet.transfer(user.address, amount, [adminOneSplitSignature, adminTwoSplitSignature])
        await multiSigWallet.transfer(user.address, amount, [adminOneSplitSignature, adminTwoSplitSignature])

        const after = await ethers.provider.getBalance(user.address)

        expect(after).to.equal(before.add(ethers.utils.parseEther("2")))
    })
})
