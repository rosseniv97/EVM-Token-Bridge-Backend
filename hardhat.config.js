const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");

task('deploy-apple-router', "Deploys Apple Contracts")
  .setAction(async (taskArguments, hre, runSuper) => {
  const deployApple = require("./scripts/deploy-apple");
  await deployApple();
})

task('deploy-lime-router', "Deploys Lime Contracts")
  .setAction(async (taskArguments, hre, runSuper) => {
  const deployLime = require("./scripts/deploy-lime");
  await deployLime();
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.5",
      },
      {
        version: "0.8.4",
      },
    ]
  },
    networks: {
      ropsten: {
        url: "https://ropsten.infura.io/v3/40c2813049e44ec79cb4d7e0d18de173",
        accounts: [
          "efbe4b1c26a84654c152b53fed94f51e1f2b63c868c683546cad4bc8c086ce31",
        ],
      },
      rinkeby: {
        url: "https://rinkeby.infura.io/v3/40c2813049e44ec79cb4d7e0d18de173",
        accounts: [
          "efbe4b1c26a84654c152b53fed94f51e1f2b63c868c683546cad4bc8c086ce31",
        ],
      },
    }
};
