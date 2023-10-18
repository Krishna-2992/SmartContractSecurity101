require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, 
      blockGasLimit: 20000000,
    }
  }, 
  gasReporter: {
    enabled: false, 
    currency: "USD"
  }
};
