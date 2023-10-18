const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { ethers } = require('hardhat')
const { expect } = require("chai");

describe("AgreedPrice", ()=>{
  async function deployFixtures() {
    const [owner, attacker] = await ethers.getSigners()
    const AgreedPrice = await ethers.getContractFactory("AgreedPrice")
    const agreedPrice = await AgreedPrice.deploy(100)
    agreedPrice.deployed()
    return {agreedPrice, owner, attacker}
  }

  describe("deployment", ()=>{
    it("should set the price at deployment", async () => {
      const {agreedPrice} = await deployFixtures()
      expect(await agreedPrice.price()).to.equal(100)
    })

    it("should set the deployer address to be owner", async () => {
      const {agreedPrice, owner} = await deployFixtures()
      expect(await agreedPrice.owner()).to.equal(owner.address)
    })

    it("should be possible for the owner to change the price", async () => {
      const {agreedPrice, owner} = await deployFixtures()
      await agreedPrice.updatePrice(200)
      expect(await agreedPrice.price()).to.equal(200)
    })

    it("should NOT be possible for attacker to change the price", async () => {
      const {agreedPrice, attacker} = await deployFixtures()
      await expect(agreedPrice.connect(attacker).updatePrice(200)).to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("should allow owner to change the owner", async () => {
      const {agreedPrice, attacker} = await deployFixtures()
      await agreedPrice.transferOwnership(attacker.address);
      await agreedPrice.connect(attacker).updatePrice(200)
      expect(await agreedPrice.price()).to.equal(200)
    })
    it("should reject actual owner after owner change", async () => {
      const {agreedPrice, attacker} = await deployFixtures()
      await agreedPrice.transferOwnership(attacker.address);
      await expect(agreedPrice.updatePrice(200)).to.be.revertedWith("Ownable: caller is not the owner")
    })

  })
})


