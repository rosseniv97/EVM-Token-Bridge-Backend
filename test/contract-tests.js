const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LMTToken", function () {
  let tokenFactory;
  let tokenContract;
  let deployer;
  before(async ()=> {
    [deployer] = await ethers.getSigners()
    tokenFactory = await ethers.getContractFactory("LMT");
    tokenContract = await tokenFactory.deploy();

    await tokenContract.deployed();

    routerFactory = await ethers.getContractFactory("LMT");
    routerContract = await routerFactory.deploy();

    await routerContract.deployed();
  })
  it("Should mint 200 000 LMT on deployment", async function () {
    expect(ethers.utils.formatEther( await tokenContract.totalSupply())).to.be.equal('200000.0')
  });
  it("Should assign the initially minted 200 000 LMT to the deployer", async function () {
    expect(ethers.utils.formatEther( await tokenContract.balanceOf(deployer.address))).to.be.equal('200000.0')
  });
  it("Should be able to setup roles to a calling contract address that has the same owner address", async function () {
    //
  });
});
