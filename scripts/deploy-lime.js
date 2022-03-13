const hre = require("hardhat");

async function main() {

  const LimeToken = await hre.ethers.getContractFactory("LimeToken");
  const limeToken = await LimeToken.deploy();

  await limeToken.deployed();

  console.log("LimeToken deployed to:", limeToken.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
