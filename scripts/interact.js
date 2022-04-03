const { ethers, Signer } = require("ethers");
const {
  formatEther,
  parseEther,
  keccak256,
  formatBytes32String,
  getAddress,
} = require("ethers/lib/utils");
const hre = require("hardhat");
const appleRouter = require("../artifacts/contracts/ropsten/AppleRouter.sol/AppleRouter.json");
const limeRouter = require("../artifacts/contracts/rinkeby/LimeRouter.sol/LimeRouter.json");
const APT = require("../artifacts/contracts/ropsten/AppleToken.sol/APT.json");

const run = async function () {
  // const walletPrivateKey = "8bdb66e10830c94a62f6947b0e7bb69b2fc705805b59b7b1c39028c676d46fe1";
  // const provider = new hre.ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173");
  // const appleRouterAddress = "0xcbF714B8BFcba59d911737AC456ec9fD24517B4b";

  // const wallet = new hre.ethers.Wallet(walletPrivateKey, provider);

  const providerURL = "http://localhost:8545";
  const walletApplePrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const walletLimePrivateKey =
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
  const providerApple = new ethers.providers.JsonRpcProvider(providerURL);
  const walletApple = new ethers.Wallet(walletApplePrivateKey, providerApple);
  const providerLime = new ethers.providers.JsonRpcProvider(providerURL);
  const walletLime = new ethers.Wallet(walletLimePrivateKey, providerLime);

  const appleRouterAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  const appleTokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
  const appleRouterContract = new hre.ethers.Contract(
    appleRouterAddress,
    appleRouter.abi,
    walletApple
  );
  const appleTokenContract = new hre.ethers.Contract(
    appleTokenAddress,
    APT.abi,
    walletApple
  );

  const limeRouterAddress = "0x05Aa229Aec102f78CE0E852A812a388F076Aa555";
  const limeTokenAddress = "0x0b48aF34f4c854F5ae1A3D587da471FeA45bAD52";
  const limeRouterContract = new hre.ethers.Contract(
    limeRouterAddress,
    limeRouter.abi,
    walletLime
  );
  const limeTokenContract = new hre.ethers.Contract(
    limeTokenAddress,
    APT.abi,
    walletLime
  );

  const approveBlockTx = await limeTokenContract.approve(
    appleRouterAddress,
    parseEther("1000")
  );
  await approveBlockTx.wait();
  console.log(
    formatEther(await limeTokenContract.balanceOf(walletLime.address))
  );
  const approveReleaseTx = await limeTokenContract.approve(
    limeRouterAddress,
    parseEther("1000")
  );
  const lockTx = await limeRouterContract.lockAmount(
    walletApple.address,
    parseEther("500")
  );
  await lockTx.wait();
  let balance = await limeTokenContract.balanceOf(walletLime.address);
  console.log("Balance Lime:", formatEther(balance));
  let contractLMTBalance = await limeTokenContract.balanceOf(limeRouterAddress);
  console.log("Contract LMT balance:", formatEther(contractLMTBalance));

  limeRouterContract.on(
    "LMTTokenLocked",
    async (sender, amount, receivingAddress) => {
      console.log(receivingAddress);
      const approveReleaseTx = await appleTokenContract.approve(
        appleRouterAddress,
        parseEther("1000")
      );
      await approveReleaseTx.wait();
      console.log(
        formatEther(await appleTokenContract.balanceOf(appleRouterContract.address))
      );
      const releaseTx = await appleRouterContract.releaseAmount(
        parseEther(amount.toString()),
        receivingAddress
      );
      await releaseTx.wait();
      let balance = formatEther(await appleTokenContract.balanceOf(walletApple.address));
      console.log("Balance Apple:", balance.toString());
      contractAPTBalance = formatEther(await appleTokenContract.balanceOf(
        appleRouterAddress
      ));
      console.log("Contract APT balance:", contractAPTBalance);
    }
  );
};

run();
