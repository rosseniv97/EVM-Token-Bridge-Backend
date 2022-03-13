//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import './AppleToken.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract AppleRouter is Ownable {
    APT private APTToken;
    uint256 constant TRANSACTION_FEE = 1000;

    event APTTokenLocked(address sender, uint256 amount, address receivingWallet);
    event APTTokenReleased(address sender, uint256 amount);

    constructor (address APTTockenAddress) {
        APTToken = APT(APTTockenAddress);
    }

    function lockAmount(address receivingWallet, uint256 amount) public {
        require( amount > 0, "At least 1 APT needs to be locked" );
        APTToken.transferFrom(msg.sender, address(this), amount);
        emit APTTokenLocked(msg.sender, amount - TRANSACTION_FEE, receivingWallet);
    }

    function releaseAmount(uint256 amount) public {
        require( amount > 0, "At least 1 APT needs to be released" );
        if(APTToken.balanceOf(address(this)) <= amount) {
            APTToken.mint(msg.sender, amount);
        } else {
            APTToken.transferFrom(address(this), msg.sender, amount);
        }
        emit APTTokenReleased(msg.sender, amount); 
    }

}