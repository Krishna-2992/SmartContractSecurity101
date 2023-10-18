const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers')
const {ethers} = require('hardhat')
const {expect} = require("chai")

describe("Upgradeable Contracts", () => {
    async function deployFixture() {
        const [deployer, user, attacker] = await ethers.getSigners()

        const LogicV1 = await ethers.getContractFactory("LogicV1")
        const logicV1 = await LogicV1.deploy()
        await logicV1.deployed()

        const LogicV2 = await ethers.getContractFactory("LogicV2")
        const logicV2 = await LogicV2.deploy()
        await logicV2.deployed()

        const Proxy = await ethers.getContractFactory('Proxy')
        const proxy = await Proxy.deploy(logicV1.address)
        await proxy.deployed()

        const proxyPattern = await ethers.getContractAt("LogicV1", proxy.address)
        

        return {proxy, logicV1, logicV2, proxyPattern, deployer, user, attacker}
    }

    describe("Proxy", ()=>{
        // it("should return the address of logicV1 when checked", async () => {
        //     const {proxy, logicV1} = await deployFixture()
        //     expect(await proxy.logicContract()).to.equal(logicV1.address)
        // })
        
        // it("should revert if anyone other than ownre tries to upgrade", async () => {
        //     const {proxy, logicV1, user} = await deployFixture()
        //     await expect(proxy.connect(user).upgrade(logicV1.address)).to.be.revertedWith("Access restricted!!")
        // })
        
        // it("should upgrade the logic address if called by owner", async ()=> {
        //     const {proxy, logicV1} = await deployFixture()
        //     await proxy.upgrade(logicV1.address)
        //     expect(await proxy.logicContract()).to.equal(logicV1.address)
        // })
        // it("calling increaseX of logicV1 will increase the value of x of proxy contract!", async () => {
        //     const {proxy, proxyPattern, logicV1, user} = await deployFixture()
        //     await proxyPattern.connect(user).increaseX()
        //     expect(await proxy.x()).to.equal(1)
        //     expect(await logicV1.x()).to.equal(0)
        // })
        it("calling increaseX of logicV2 will increase the value of x of proxy contract by 2!", async () => {
            const {proxy, logicV2, user} = await deployFixture()
            await proxy.upgrade(logicV2.address)
            const proxyPattern2 = await ethers.getContractAt("LogicV2", proxy.address)
            console.log('proxyPattern2', proxyPattern2)
            await proxyPattern2.connect(user).increaseX()
            expect(await proxy.x()).to.equal(2)
            expect(await logicV2.x()).to.equal(0)
        })
        it("should set y", async () => {
            const {proxy, logicV2, user} = await deployFixture()
            await proxy.upgrade(logicV2.address)
            const proxyPattern2 = await ethers.getContractAt("LogicV2", proxy.address)
            await proxyPattern2.connect(user).increaseY(5)
            expect(await proxy.owner()).to.equal("0x0000000000000000000000000000000000000005")
        })
    })
})
