const { expect } = require("chai");
const { formatBytes32String, keccak256, toUtf8Bytes, toUtf8String, parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("LMTToken", function () {
  let tokenContract;
  let routerContract;
  let deployer;
  const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));

  before(async ()=> {
    [deployer, address1] = await ethers.getSigners()

    let routerFactory = await ethers.getContractFactory("LimeRouter");
    routerContract = await routerFactory.deploy(parseEther('0.01'));

    await routerContract.deployed();

    let tokenFactory = await ethers.getContractFactory("LMT");
    tokenContract = await tokenFactory.deploy(routerContract.address);

    await tokenContract.deployed();

  })
  it("Should mint 200 000 LMT on deployment", async function () {
    expect(ethers.utils.formatEther( await tokenContract.totalSupply())).to.be.equal('200000.0')
  });
  it("Should assign the initially minted 200 000 LMT to the deployer", async function () {
    expect(ethers.utils.formatEther( await tokenContract.balanceOf(deployer.address))).to.be.equal('200000.0')
  });
  it("Should have given MINTER_ROLE to the router contract", async function () {
    expect(await tokenContract.hasRole(MINTER_ROLE, routerContract.address)).to.be.equal(true)
  });
});
