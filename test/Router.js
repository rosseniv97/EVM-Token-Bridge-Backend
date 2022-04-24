const { expect } = require("chai");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const ERC20PresetMinterPauser = require("../artifacts/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol/ERC20PresetMinterPauser.json");

describe("Router interactions", function () {
  let APTToken;
  let APTRouter;
  let LMTToken;
  let LMTRouter;
  let wrappedToken;
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

  it("Should be able to lock Token amount", async function () {
    const amountLocked = "1000";

    const approveTx = await LMTToken.approve(
      LMTRouter.address,
      parseEther(amountLocked)
    );
    await approveTx.wait();

    const beforeLockBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );

    const lockAmountTx = await LMTRouter.lock(
      LMTToken.address,
      parseEther(amountLocked)
    );
    await lockAmountTx.wait();

    const afterLockBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );
    expect(beforeLockBalance - afterLockBalance).to.be.equal(
      parseFloat(amountLocked)
    );
  });

  it("Should be able to release Token amount", async function () {
    const amountReleased = "1000";

    const beforeReleaseBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );

    const releaseAmountTx = await LMTRouter.release(
      LMTToken.address,
      deployer.address,
      parseEther(amountReleased)
    );
    await releaseAmountTx.wait();

    const afterReleaseBalance = formatEther(
      await LMTToken.balanceOf(deployer.address)
    );
    expect(afterReleaseBalance - beforeReleaseBalance).to.be.equal(
      parseFloat(amountReleased)
    );
  });

  it("Should be able to claim wrapped tokens on the target network", async function () {
    const amountLocked = "1000";
    let beforeWrappedBalance;
    const wrappedTokenAddress = await APTRouter.nativeToWrapped(
      LMTToken.address
    );

    const wrappedTokenContract = parseInt(wrappedTokenAddress, 16)
      ? new ethers.Contract(
          wrappedTokenAddress,
          ERC20PresetMinterPauser.abi,
          deployer
        )
      : null;
    beforeWrappedBalance = wrappedTokenContract
      ? formatEther(await wrappedTokenContract.balanceOf(deployer.address))
      : 0;

    APTRouter.on(
      "TokenClaimed",
      async (receiverAddress, amount, wrappedTokenAddress) => {
        wrappedToken = new ethers.Contract(
          wrappedTokenAddress,
          ERC20PresetMinterPauser.abi,
          deployer
        );
        if (wrappedToken) {
          const afterWTBalance = formatEther(
            await wrappedToken.balanceOf(deployer.address)
          );
          expect(afterWTBalance - beforeWrappedBalance).to.be.equal(
            amountLocked
          );
        }
      }
    );

    const claimTx = await APTRouter.claim(
      deployer.address,
      LMTToken.address,
      parseEther(amountLocked)
    );
    await claimTx.wait();
  });

  it("Should be able to burn certain amount", async function () {
    const amountBurned = "1000";
    const wrappedTokenAddress = await APTRouter.nativeToWrapped(
      LMTToken.address
    );

    const wrappedTokenContract = parseInt(wrappedTokenAddress, 16)
      ? new ethers.Contract(
          wrappedTokenAddress,
          ERC20PresetMinterPauser.abi,
          deployer
        )
      : null;
    beforeWrappedBalance = wrappedTokenContract
      ? formatEther(await wrappedTokenContract.balanceOf(deployer.address))
      : 0;
    const approveTx = await wrappedTokenContract.approve(
      APTRouter.address,
      parseEther(amountBurned)
    );
    await approveTx.wait();
    APTRouter.on("TokenBurned", async (sender, amount, wrappedTokenAddress) => {
      wrappedToken = new ethers.Contract(
        wrappedTokenAddress,
        ERC20PresetMinterPauser.abi,
        sender
      );
      if (wrappedToken) {
        const afterWTBalance = formatEther(
          await wrappedToken.balanceOf(deployer.address)
        );
        expect(afterWTBalance - beforeWrappedBalance).to.be.equal(amountBurned);
      }
    });

    const burnTx = await APTRouter.burn(
      wrappedTokenAddress,
      LMTToken.address,
      parseEther(amountBurned)
    );
    await burnTx.wait();
  });
});
