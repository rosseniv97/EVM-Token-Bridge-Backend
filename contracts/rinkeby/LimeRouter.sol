//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "./LimeToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LimeRouter is Ownable {
    LMT private LMTToken;
    uint256 constant TRANSACTION_FEE = 10000000000000000;

    event LMTTokenLocked(
        address sender,
        uint256 amount,
        address receivingWallet
    );
    event LMTTokenReleased(address sender, uint256 amount);

    constructor(address LMTTokenAddress) {
        LMTToken = LMT(LMTTokenAddress);
    }

    function getLMTToken() public view onlyOwner returns (LMT) {
        return LMTToken;
    }

    function lockAmount(address receivingWallet, uint256 amount) public returns(uint256) {
        require(amount > 0, "At least 1 LMT needs to be locked");
        LMTToken.transferFrom(msg.sender, address(this), amount);
        emit LMTTokenLocked(
            msg.sender,
            amount - TRANSACTION_FEE,
            receivingWallet
        );
        return amount - TRANSACTION_FEE;
    }

    function releaseAmount(uint256 amount) public {
        require(amount > 0, "At least 1 LMT needs to be released");
        if (LMTToken.balanceOf(address(this)) <= amount) {
            LMTToken.mint(msg.sender, amount);
        } else {
            LMTToken.transferFrom(address(this), msg.sender, amount);
        }
        emit LMTTokenReleased(msg.sender, amount);
    }
}
