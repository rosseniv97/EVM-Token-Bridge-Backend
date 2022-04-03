const { ethers } = require("ethers");
const { formatEther, parseEther, keccak256, formatBytes32String } = require("ethers/lib/utils");
const hre = require("hardhat");
const appleRouter = require('../artifacts/contracts/ropsten/AppleRouter.sol/appleRouter.json');
const APT = require("../artifacts/contracts/ropsten/AppleToken.sol/APT.json");

const run = async function() {
	// const walletPrivateKey = "8bdb66e10830c94a62f6947b0e7bb69b2fc705805b59b7b1c39028c676d46fe1";
	// const provider = new hre.ethers.providers.InfuraProvider("ropsten", "40c2813049e44ec79cb4d7e0d18de173");
    // const appleRouterAddress = "0xcbF714B8BFcba59d911737AC456ec9fD24517B4b"; 

    // const wallet = new hre.ethers.Wallet(walletPrivateKey, provider);
    const MINTER_ROLE = keccak256(formatBytes32String("MINTER_ROLE"));

    const providerURL = "http://localhost:8545";
	const walletPrivateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
	
    const appleRouterAddress = "0x9d4454B023096f34B160D6B654540c56A1F81688";
    const tokenAddress = "0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00";
    const provider = new ethers.providers.JsonRpcProvider(providerURL)
    const wallet = new ethers.Wallet(walletPrivateKey, provider)

    const appleRouterContract = new hre.ethers.Contract(appleRouterAddress, appleRouter.abi, wallet);

	const tokenContract = new hre.ethers.Contract(tokenAddress, APT.abi, wallet)

    const totalAPTSupply = await tokenContract.totalSupply();

    const approveTx = await tokenContract.approve(appleRouterAddress, parseEther('1000'))
	await approveTx.wait()

    console.log(await tokenContract.balanceOf(appleRouterContract.address))

    const lockTx = await appleRouterContract.releaseAmount(parseEther('500'))
    await lockTx.wait()

	// const lockTx = await appleRouterContract.lockAmount(appleRouterAddress, maxReleaseAmount.div(6))
    // await lockTx.wait()

	balance = await tokenContract.balanceOf(wallet.address)
	console.log("Balance:", balance.toString())

	contractAPTBalance = await tokenContract.balanceOf(appleRouterAddress);
	console.log("Contract APT balance:", contractAPTBalance.toString())
	
}

run()