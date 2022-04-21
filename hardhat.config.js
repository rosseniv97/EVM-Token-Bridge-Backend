const { task } = require("hardhat/config");
require('dotenv').config({path:__dirname+'/.env'});
require("@nomiclabs/hardhat-waffle");

const { API_ROPSTEN_URL, API_RINKEBY_URL, PRIVATE_KEY } = process.env;

task('deploy-apple', "Deploys Apple contracts")
  .setAction(async (taskArguments, hre, runSuper) => {
  const deployApple = require("./scripts/deploy-ropsten");
  await deployApple();
})

task('deploy-lime', "Deploys Lim contracts")
  .setAction(async (taskArguments, hre, runSuper) => {
  const deployLime = require("./scripts/deploy-rinkeby");
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
        url: API_ROPSTEN_URL,
        accounts: [
          PRIVATE_KEY,
        ],
      },
      rinkeby: {
        url: API_RINKEBY_URL,
        accounts: [
          PRIVATE_KEY,
        ],
      }
    }
};
