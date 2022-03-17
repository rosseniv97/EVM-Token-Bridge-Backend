const hre = require("hardhat");

async function deployLime() {
  await hre.run('compile');

  const [deployer] = await hre.ethers.getSigners(); // We are getting the deployer

  console.log('Deploying with the account at address:', deployer.address);

  const LimeToken = await hre.ethers.getContractFactory("LMT");
  const limeToken = await LimeToken.deploy();

  await limeToken.deployed();
  console.log("LimeToken deployed to:", limeToken.address);

  const LimeRouter = await hre.ethers.getContractFactory("LimeRouter");
  const limeRouter = await LimeRouter.deploy(limeToken.address)

  await limeRouter.deployed();
  console.log("LimeRouter deployed to:", limeRouter.address);

}

module.exports = deployLime;
