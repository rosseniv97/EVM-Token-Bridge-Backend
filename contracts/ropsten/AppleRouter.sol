//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./AppleToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AppleRouter is Ownable {
    APT public APTToken;
    uint256 public transactionFee;

    event APTTokenLocked(
        address sender,
        uint256 amount,
        address receivingWallet
    );
    event APTTokenReleased(address sender, uint256 amount);

    constructor(uint256 feePerTransaction) {
        transactionFee = feePerTransaction;
    }

    function lockAmount(address receivingWallet, uint256 amount) public {
        require(amount > 0, "At least 1 APT needs to be locked");
        APTToken.transferFrom(msg.sender, address(this), amount);
        emit APTTokenLocked(
            msg.sender,
            amount - transactionFee,
            receivingWallet
        );
    }

    function setAPTTokenInstance(address APTTokenAddress) public onlyOwner {
        APTToken = APT(APTTokenAddress);
    }

    function releaseAmount(uint256 amount, address receivingWallet) public {
        require(amount > 0, "At least 1 APT needs to be released");
        if (APTToken.balanceOf(address(this)) <= amount) {
            APTToken.mint(receivingWallet, amount);
        } else {
            APTToken.transferFrom(address(this), receivingWallet, amount);
        }
        emit APTTokenReleased(receivingWallet, amount);
    }
}
