const { expect } = require("chai");
const { formatBytes32String, keccak256, parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("LimeRouter", function () {
  let tokenContract;
  let routerContract;
  const receiverAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' 
  let deployer;
  const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));

  before(async ()=> {
    [deployer] = await ethers.getSigners()

    let routerFactory = await ethers.getContractFactory("LimeRouter");
    routerContract = await routerFactory.deploy(parseEther('0.01'));

    await routerContract.deployed();

    let tokenFactory = await ethers.getContractFactory("LMT");
    tokenContract = await tokenFactory.deploy(routerContract.address);

    await tokenContract.deployed();

    const approveTx = await tokenContract.approve(routerContract.address, parseEther('5000'));
    await approveTx.wait()

  })
  xit("Should be able to lock certain amount of LMT and withhold a transaction fee", async function () {
    const amountLocked = '1000'; 
    const beforeLockBalance = formatEther(await tokenContract.balanceOf(deployer.address));  
    const lockAmountTx = await routerContract.lockAmount(receiverAddress, parseEther(amountLocked));
    await lockAmountTx.wait()

    const afterLockBalance = formatEther(await tokenContract.balanceOf(deployer.address));  
    expect((beforeLockBalance - afterLockBalance).toString()).to.be.equal(amountLocked);
  });
  xit("Should be able to release certain amount", async function () {
    const amountReleased = '1000';

    console.log(await tokenContract.hasRole(MINTER_ROLE, routerContract.address))
    
    const beforeReleaseBalance = formatEther(await tokenContract.balanceOf(receiverAddress));

    const releaseAmountTx = await routerContract.releaseAmount(parseEther(amountReleased), receiverAddress);
    await releaseAmountTx.wait()

    const afterReleaseBalance = formatEther(await tokenContract.balanceOf(receiverAddress));  
    expect((afterReleaseBalance - beforeReleaseBalance).toString()).to.be.equal(amountReleased);
    
   
  });
});

