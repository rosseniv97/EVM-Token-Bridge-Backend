const { ethers } = require("ethers");
const hre = require("hardhat");
const AppleRouter = require('../artifacts/contracts/AppleRouter.sol/AppleRouter.json');
const APT = require("../artifacts/contracts/AppleToken.sol/APT.json");

const run = async function() {
	// const walletPrivateKey = "8bdb66e10830c94a62f6947b0e7bb69b2fc705805b59b7b1c39028c676d46fe1";
	// const provider = new hre.ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173");
    // const appleRouterAddress = "0xcbF714B8BFcba59d911737AC456ec9fD24517B4b"; 

    // const wallet = new hre.ethers.Wallet(walletPrivateKey, provider);

    const providerURL = "http://localhost:8545";
	const walletPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
	
    const appleRouterAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
    const provider = new ethers.providers.JsonRpcProvider(providerURL)
    const wallet = new ethers.Wallet(walletPrivateKey, provider)

    const appleRouterContract = new hre.ethers.Contract(appleRouterAddress, AppleRouter.abi, wallet);

    const tokenAddress = await appleRouterContract.APTToken();

	const tokenContract = new hre.ethers.Contract(tokenAddress, APT.abi, wallet)

    const totalAPTSupply = await tokenContract.totalSupply();

    const maxReleaseAmount = ethers.BigNumber.from(totalAPTSupply).div(2);

    const approveTx = await tokenContract.approve(appleRouterAddress, maxReleaseAmount)
	await approveTx.wait()

    const lockTx = await appleRouterContract.releaseAmount(maxReleaseAmount.div(6))
    await lockTx.wait()

	// const lockTx = await appleRouterContract.lockAmount(appleRouterAddress, maxReleaseAmount.div(6))
    // await lockTx.wait()

	balance = await tokenContract.balanceOf(wallet.address)
	console.log("Balance:", balance.toString())

	contractAPTBalance = await tokenContract.balanceOf(appleRouterAddress);
	console.log("Contract APT balance:", contractAPTBalance.toString())
	
}

run()