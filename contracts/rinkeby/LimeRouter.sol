//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./LimeToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimeRouter is Ownable {
    LMT public LMTToken;
    uint256 public transactionFee;

    event LMTTokenLocked(
        address sender,
        uint256 amount,
        address receivingWallet
    );
    event LMTTokenReleased(address sender, uint256 amount);

    constructor(uint256 feePerTransaction) {
        transactionFee = feePerTransaction;
    }

    function setLMTTokenInstance(address LMTTokenAddress) public onlyOwner {
        LMTToken = LMT(LMTTokenAddress);
    }

    function lockAmount(address receivingWallet, uint256 amount) public {
        require(amount > 0, "At least 1 LMT needs to be locked");
        LMTToken.transferFrom(msg.sender, address(this), amount);
        emit LMTTokenLocked(
            msg.sender,
            amount - transactionFee,
            receivingWallet
        );
    }

    function releaseAmount(uint256 amount, address receivingWallet) public {
        require(amount > 0, "At least 1 LMT needs to be released");
        if (LMTToken.balanceOf(address(this)) <= amount) {
            LMTToken.mint(receivingWallet, amount);
        } else {
            LMTToken.transferFrom(address(this), receivingWallet, amount);
        }
        emit LMTTokenReleased(receivingWallet, amount);
    }
}
