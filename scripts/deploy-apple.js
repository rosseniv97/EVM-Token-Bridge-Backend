const hre = require("hardhat");
const { formatBytes32String, keccak256, parseEther} = require("ethers/lib/utils");

async function deployApple() {
  await hre.run('compile');

  const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));
  const BURNER_ROLE = keccak256(formatBytes32String("BURNER_ROLE"));

  const [deployer] = await hre.ethers.getSigners(); // We are getting the deployer

  console.log('Deploying with the account at address:', deployer.address);

  
  const appleRouter = await hre.ethers.getContractFactory("AppleRouter");
  const AppleRouter = await appleRouter.deploy(parseEther('0.01'))

  await AppleRouter.deployed();
  console.log("AppleRouter deployed to:", AppleRouter.address);

  const appleToken = await hre.ethers.getContractFactory("APT");
  const AppleToken = await appleToken.deploy(AppleRouter.address);

  await AppleToken.deployed();
  console.log("AppleToken deployed to:", AppleToken.address);

  await AppleRouter.setAPTTokenInstance( AppleToken.address)

}

module.exports = deployApple;
