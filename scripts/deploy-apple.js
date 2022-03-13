const { ethers } = require("hardhat");
const hre = require("hardhat");

async function deployApple() {
  await hre.run('compile');

  const [deployer] = await ethers.getSigners(); // We are getting the deployer

  console.log('Deploying with the account at address:', deployer.address);

  const AppleToken = await hre.ethers.getContractFactory("APT", deployer);
  const appleToken = await AppleToken.deploy();

  await appleToken.deployed();

  console.log("AppleToken deployed to:", appleToken.address);

  const AppleRouter = await hre.ethers.getContractFactory("AppleRouter");
  const appleRouterContract = await AppleRouter.deploy(appleToken.address);

  await appleRouterContract.deployed();

  console.log("AppleRouter deployed to:", appleRouterContract.address);
}

module.exports = deployApple;