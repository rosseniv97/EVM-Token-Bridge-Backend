const { expect } = require("chai");
const { formatBytes32String, keccak256, toUtf8Bytes, toUtf8String, parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("LimeRouter", function () {
  let tokenFactory;
  let tokenContract;
  let routerContractInstance;
  let tokenContractInstance;
  let deployer;
  const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));

  before(async ()=> {
    [deployer, account1] = await ethers.getSigners()
    tokenFactory = await ethers.getContractFactory("LMT");
    tokenContract = await tokenFactory.deploy();

    await tokenContract.deployed();

    routerFactory = await ethers.getContractFactory("LimeRouter");
    routerContract = await routerFactory.deploy(tokenContract.address);

    await routerContract.deployed();

    const approveTx = await tokenContract.approve(routerContract.address, parseEther('5000'));
    await approveTx.wait()

  })
  it("Should be able to lock certain amount of LMT and withhold a transaction fee", async function () {
    const amountLocked = '1000';
    const receiverAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'  
    const beforeLockBalance = formatEther(await tokenContract.balanceOf(deployer.address));  
    const amountTransferedTx = await routerContract.lockAmount(receiverAddress, parseEther(amountLocked));
    await amountTransferedTx.wait()

    const afterLockBalance = formatEther(await tokenContract.balanceOf(deployer.address));  
    expect((beforeLockBalance - afterLockBalance).toString()).to.be.equal(amountLocked);
  });
  it("Should be able to release certain amount", async function () {
    const amountReleased = '1000';

    await tokenContract.setupRouterRoles([MINTER_ROLE], routerContract.address);
    console.log(await tokenContract.hasRole(MINTER_ROLE, routerContract.address))
    
    const beforeReleaseBalance = formatEther(await tokenContract.balanceOf(deployer.address));

    const amountTransferedTx = await routerContract.releaseAmount(parseEther(amountReleased));
    await amountTransferedTx.wait()

    const afterReleaseBalance = formatEther(await tokenContract.balanceOf(deployer.address));  
    expect((afterReleaseBalance - beforeReleaseBalance).toString()).to.be.equal(amountLocked);
    
   
  });
});

