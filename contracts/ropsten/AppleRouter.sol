//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./AppleToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//Generic router
contract Router is Ownable {
    // Generic ERC20
    ERC20 public token;
    ERC20PresetMinterPauser wrappedTokenInstance;
    uint256 public transactionFee;
    mapping(address => address) public wrappedTokensMap;

    event TokenLocked(address sender, uint256 amount, address receivingAddress);

    event TokenClaimed(
        address receiverAddress,
        uint256 amount,
        address wrappedTokenAddress
    );

    event TokenBurned(
        address sender,
        uint256 amount,
        address nativeTokenAddress
    );
    event APTTokenReleased(address sender, uint256 amount);

    constructor(uint256 feePerTransaction) {
        transactionFee = feePerTransaction;
    }

    // tokenContract.approve(routerAddress, amount) from the FE
    function lockAmount(address tokenContractAddress, uint256 amount) public {
        require(amount > 0, "At least 1 token needs to be locked");
        token = ERC20(tokenContractAddress);
        token.transferFrom(msg.sender, address(this), amount);
        emit TokenLocked(msg.sender, amount, tokenContractAddress);
    }

    function claim(
        address receiverAddress,
        address tokenContractAddress,
        uint256 amount
    ) public {
        address wrappedTokenAddress = wrappedTokensMap[tokenContractAddress];

        if (wrappedTokenAddress != 0) {
            wrappedTokenInstance = ERC20PresetMinterPauser(wrappedTokenAddress);
        } else {
            wrappedTokenInstance = new ERC20PresetMinterPauser(
                wrappedTokenAddress
            );
            wrappedTokensMap[tokenContractAddress] = wrappedTokenInstance;
        }
        wrappedTokenInstance.mint(receiverAddress, amount);
        
        emit TokenClaimed(receiverAddress, amount, wrappedTokenAddress);
    }

    // wrappedTokenContract.approve(routerAddress, amount) from the FE
    function burn(address wrappedTokenAddress, uint256 amount) public {
        require(wrappedTokensMap[token] != 0, "The bridge hasn't minted this wrapped token"); 
            wrappedTokenInstance = wrappedTokensMap[wrappedTokenAddress];
            wrappedTokenInstance.transferFrom(msg.sender, address(this));
            wrappedTokenInstance.burn(amount);

    }

    // token contract address as a parameter
    function releaseAmount(uint256 amount, address receivingAddress) public {
        //approve
        require(amount > 0, "At least 1 APT needs to be released");
        if (APTToken.balanceOf(address(this)) <= amount) {
            APTToken.mint(receivingWallet, amount);
        } else {
            APTToken.transferFrom(address(this), receivingWallet, amount);
        }
        emit APTTokenReleased(receivingWallet, amount);
    }
}
