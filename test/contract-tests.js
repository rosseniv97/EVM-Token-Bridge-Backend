const { expect } = require("chai");
const { formatBytes32String, keccak256, toUtf8Bytes, toUtf8String } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("LMTToken", function () {
  let tokenFactory;
  let tokenContract;
  let tokenContractInstance;
  let deployer;
  const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));
  const BURNER_ROLE = keccak256(formatBytes32String("BURNER_ROLE"));

  before(async ()=> {
    [deployer, address1] = await ethers.getSigners()
    tokenFactory = await ethers.getContractFactory("LMT");
    tokenContract = await tokenFactory.deploy();

    await tokenContract.deployed();

    routerFactory = await ethers.getContractFactory("LimeRouter");
    routerContract = await routerFactory.deploy(tokenContract.address);

    await routerContract.deployed();

  })
  it("Should mint 200 000 LMT on deployment", async function () {
    expect(ethers.utils.formatEther( await tokenContract.totalSupply())).to.be.equal('200000.0')
  });
  it("Should assign the initially minted 200 000 LMT to the deployer", async function () {
    expect(ethers.utils.formatEther( await tokenContract.balanceOf(deployer.address))).to.be.equal('200000.0')
  });
  it("Should be able to set a MINTER_ROLE to the router contract address that has the same owner address", async function () {
    const routerOwner = await routerContract.owner();
    tokenContractInstance = await tokenContract.connect(deployer);
    await tokenContract.connect(deployer).setupRouterRoles([MINTER_ROLE], routerContract.address);
    expect(await tokenContract.hasRole(MINTER_ROLE, routerContract.address)).to.be.equal(true)
  });
  it("Should be able to set a BURNER_ROLE to the router contract address that has the same owner address", async function () {
    tokenContractInstance = await tokenContract.connect(deployer);
    await tokenContractInstance.setupRouterRoles([BURNER_ROLE], routerContract.address);
    expect(await tokenContract.hasRole(BURNER_ROLE, routerContract.address)).to.be.equal(true)
  });
  it("Shouldn't let other account than the deployer to set up router roles", async function () {
    const routerOwner = await routerContract.owner();
    tokenContractInstance = await tokenContract.connect(address1);
    await tokenContractInstance.setupRouterRoles([BURNER_ROLE, MINTER_ROLE], routerContract.address);
    expect(await tokenContract.hasRole(BURNER_ROLE, routerContract.address)).to.be.equal(false)
  });
});
