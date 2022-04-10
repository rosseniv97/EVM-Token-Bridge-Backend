const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const ERC20PresetMinterPauser = require("../artifacts/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol/ERC20PresetMinterPauser.json");

describe("Router interactions", function () {
  let APTToken;
  let APTRouter;
  let LMTToken;
  let LMTRouter;
  const receiverAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8";
  let deployer;

  before(async () => {
    [deployer, address1] = await ethers.getSigners();

    console.log("Deploying with the account at address:", deployer.address);

    const APTTokenFactory = await ethers.getContractFactory("APT");
    APTToken = await APTTokenFactory.deploy();

    await APTToken.deployed();
    console.log("Apple Token deployed to:", APTToken.address);

    const APTRouterFactory = await ethers.getContractFactory("Router");
    APTRouter = await APTRouterFactory.deploy();

    await APTRouter.deployed();
    console.log("Apple Router deployed to:", APTRouter.address);

    const LMTTokenFactory = await ethers.getContractFactory("LMT");
    LMTToken = await LMTTokenFactory.deploy();

    await LMTToken.deployed();
    console.log("Lime Token deployed to:", LMTToken.address);

    const LMTRouterFactory = await ethers.getContractFactory("Router");
    LMTRouter = await LMTRouterFactory.deploy();

    await LMTRouter.deployed();
    console.log("Lime Router deployed to:", LMTRouter.address);
  });
  xit("Should be able to lock Token amount", async function () {
    const amountLocked = "1000";

    const approveTx = await LMTToken.approve(LMTRouter.address, amountLocked);
    // console.log(await LMTToken.allowance(deployer.address, LMTRouter.address))
    const beforeLockBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );
    LMTRouter.on(
      "TokenLocked",
      async (sender, amount, tokenContractAddress) => {
        const userBalance = await LMTRouter.userToLocked(sender, tokenContractAddress);
        expect(amount).to.be.equal(amountLocked);
        expect(userBalance).to.be.equal(amountLocked);
        expect(LMTToken.address).to.be.equal(tokenContractAddress);
      }
    );
    const lockAmountTx = await LMTRouter.lock(
      LMTToken.address,
      parseEther(amountLocked)
    );
    await lockAmountTx.wait();

    const afterLockBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );
    expect((beforeLockBalance - afterLockBalance).toString()).to.be.equal(
      amountLocked
    );
  });

  it("Should be able to claim wrapped tokens on the target network", async function () {
    const amountLocked = "1000";
    APTRouter.on(
      "TokenClaimed",
      async (receiverAddress, amount, wrappedTokenAddress) => {
        const wrappedToken = new ethers.Contract(
          wrappedTokenAddress,
          ERC20PresetMinterPauser.abi,
          deployer
        );
        const receiverWTBalance = await wrappedToken.balanceOf(
          receiverAddress.address
        );
        console.log(receiverWTBalance);
        expect(receiverWTBalance).to.be.equal(amount);
      }
    );
    const claimTx = await APTRouter.claim(
      deployer.address,
      LMTToken.address,
      parseEther(amountLocked)
    );
    await claimTx.wait();
  });
  xit("Should be able to release certain amount", async function () {
    const amountReleased = "1000";

    console.log(
      await tokenContract.hasRole(MINTER_ROLE, routerContract.address)
    );

    const beforeReleaseBalance = formatEther(
      await tokenContract.balanceOf(receiverAddress)
    );

    const releaseAmountTx = await routerContract.releaseAmount(
      parseEther(amountReleased),
      receiverAddress
    );
    await releaseAmountTx.wait();

    const afterReleaseBalance = formatEther(
      await tokenContract.balanceOf(receiverAddress)
    );
    expect((afterReleaseBalance - beforeReleaseBalance).toString()).to.be.equal(
      amountReleased
    );
  });
});
