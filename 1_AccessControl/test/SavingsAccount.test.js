const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { assert, expect } = require('chai')
const { ethers } = require('hardhat')

describe('Interactions', () => {
    async function deployFixture() {
        const [deployer, user] = await ethers.getSigners()

        const SavingsAccount = await ethers.getContractFactory('SavingsAccount')
        const savingsAccount = await SavingsAccount.deploy()
        savingsAccount.deployed()

        const Investor = await ethers.getContractFactory('Investor')
        const investor = await Investor.deploy(savingsAccount.address)
        investor.deployed()

        return { savingsAccount, investor, deployer, user }
    }

    describe('SavingsAccount', () => {
        it('should be able to deposit in SavingsAccount properly', async () => {
            const { savingsAccount, user } = await deployFixture()
            expect(await savingsAccount.balanceOf(user.address)).to.equal(0)
            await savingsAccount.connect(user).deposit({ value: 10000000 })
            const balance = await savingsAccount.balanceOf(user.address)
            expect(balance).to.equal(10000000)
        })
        it('should be able to withdraw from SavingsAccount properly', async () => {
            const { savingsAccount, user } = await deployFixture()
            expect(await savingsAccount.balanceOf(user.address)).to.equal(0)
            await savingsAccount
                .connect(user)
                .deposit({ value: ethers.utils.parseEther('100') })
            const balance = await savingsAccount.balanceOf(user.address)
            expect(ethers.utils.formatEther(balance)).to.equal('100.0')

            await savingsAccount.connect(user).withdraw()
            expect(await savingsAccount.balanceOf(user.address)).to.equal(0)
        })
    })

    describe('Investor', () => {
        it('should be able to deposit in Investor properly', async () => {
            const { savingsAccount, investor, user } = await deployFixture()
            expect(await savingsAccount.balanceOf(investor.address)).to.equal(0)
            await investor.depositIntoSavingsAccount({ value: 10000000 })
            const balance = await savingsAccount.balanceOf(investor.address)
            expect(balance).to.equal(10000000)
        })
        it('should be able to deposit in Investor properly', async () => {
            const { savingsAccount, investor, user } = await deployFixture()
            await investor.depositIntoSavingsAccount({ value: 10000000 })
            const balance = await savingsAccount.balanceOf(investor.address)
            await investor.withdrawFromSavingsAccount()
            expect(await savingsAccount.balanceOf(investor.address)).to.equal(0)
        })

    })
})
