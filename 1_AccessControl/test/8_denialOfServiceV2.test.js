const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('DoS', () => {
    async function deployFixture() {
        const [deployer, user, attacker] = await ethers.getSigners()

        const AuctionV2 = await ethers.getContractFactory('AuctionV2')
        const auctionV2 = await AuctionV2.deploy()
        auctionV2.deployed()

        await auctionV2.bid({ value: 10000 })

        return { auctionV2, deployer, user, attacker }
    }

    describe('AuctionV2', () => {
        
        it("should not revert if thousands of bids were made by one address!!", async function () {
            const { auctionV2, attacker} = await deployFixture()
            for(let i=0; i<1500; i++){
                await auctionV2.connect(attacker).bid({value: 10001+i})
            }
            await auctionV2.withdrawRefunds()
        })
    })
})
