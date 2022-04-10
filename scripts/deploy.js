const hre = require("hardhat");
const {
  formatBytes32String,
  keccak256,
  parseEther,
} = require("ethers/lib/utils");

async function deploy() {
  await hre.run("compile");

  const [deployer] = await hre.ethers.getSigners(); // We are getting the deployer

  console.log("Deploying with the account at address:", deployer.address);

  const APTTokenFactory = await hre.ethers.getContractFactory("APT");
  const APTToken = await APTTokenFactory.deploy();

  await APTToken.deployed();
  console.log("Apple Token deployed to:", APTToken.address);

  const APTRouterFactory = await hre.ethers.getContractFactory("Router");
  const APTRouter = await APTRouterFactory.deploy();

  await APTRouter.deployed();
  console.log("Apple Router deployed to:", APTRouter.address);

  const LMTTokenFactory = await hre.ethers.getContractFactory("LMT");
  const LMTToken = await LMTTokenFactory.deploy();

  await LMTToken.deployed();
  console.log("Lime Token deployed to:", LMTToken.address);

  const LMTRouterFactory = await hre.ethers.getContractFactory("Router");
  const LMTRouter = await LMTRouterFactory.deploy();

  await LMTRouter.deployed();
  console.log("Lime Router deployed to:", LMTRouter.address);
}

module.exports = deploy;
