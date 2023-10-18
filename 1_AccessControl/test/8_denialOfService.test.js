const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('DoS', () => {
    async function deployFixture() {
        const [deployer, user, attacker] = await ethers.getSigners()

        const Auction = await ethers.getContractFactory('Auction')
        const auction = await Auction.deploy()
        auction.deployed()

        await auction.bid({ value: 10000 })

        return { auction, deployer, user, attacker }
    }

    describe('Auction', () => {
        it('should Not accept bid lower than current highestBid', async () => {
            const { auction, user } = await deployFixture()
            await expect(auction.bid({ value: 1000 })).to.be.revertedWith(
                'bid not high enough'
            )
        })
        it('should accept bid higher than current highestBid', async () => {
            const { auction, user } = await deployFixture()
            await auction.connect(user).bid({ value: 20000 })
            expect(await auction.currentLeader()).to.equal(user.address)
            expect(await auction.highestBid()).to.equal(20000)
        })
        it('should add the previous leader to the list of refunds', async () => {
            const { auction, deployer, user } = await deployFixture()
            await auction.connect(user).bid({ value: 20000 })
            const [addr, amount] = await auction.refunds(0)
            expect(addr).to.equal(deployer.address)
            expect(amount).to.equal(10000)
        })
        it('should return all the money back to the losing bidders', async () => {
            const { auction, deployer, user } = await deployFixture()
            await auction.connect(user).bid({ value: 15000 })
            await auction.bid({ value: 20000 })
            const initialBalance = await ethers.provider.getBalance(user.address)
            await auction.refundAll()
            const currentBalance = await ethers.provider.getBalance(user.address)
            expect(currentBalance).to.equal(initialBalance.add(15000))
        })
        
        it("should revert if amount of bids hit the block limit", async function () {
            const { auction, attacker} = await deployFixture()
            for(let i=0; i<1500; i++){
                await auction.connect(attacker).bid({value: 10001+i})
            }
            await auction.refundAll()
        })
    })
})
