const { parseEther } = require("ethers/lib/utils");
const hre = require("hardhat");

async function deployLime() {
  await hre.run('compile');

  const [deployerLime] = await hre.ethers.getSigners(); // We are getting the deployer

  console.log('Deploying with the account at address:', deployerLime.address);

  const LimeRouter = await hre.ethers.getContractFactory("LimeRouter", deployerLime);
  const limeRouter = await LimeRouter.deploy(parseEther('0.01'));

  await limeRouter.deployed();
  console.log("LimeRouter deployed to:", limeRouter.address);

  const LimeToken = await hre.ethers.getContractFactory("LMT", deployerLime);
  const limeToken = await LimeToken.deploy(limeRouter.address);

  await limeToken.deployed();
  console.log("LimeToken deployed to:", limeToken.address);

  await limeRouter.setLMTTokenInstance(limeToken.address);
}

module.exports = deployLime;


//Wrapper token on the router on both chains

// wAPT, wLMT

// mapping NativeToken address -> wrappedToken address

//if doesn't exist -> create wrapped token

// WrappedToken wt = WrappedToken(wrappedTokenAddress);

mapping(address => mapping(address => uint256))

// mint wToken when claimed