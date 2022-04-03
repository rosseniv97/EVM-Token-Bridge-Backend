// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LimeRouter.sol";

contract LMT is ERC20PresetMinterPauser, Ownable {

    constructor(address routerContractAddress) ERC20PresetMinterPauser("LimeToken", "LMT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
		 _setupRole(MINTER_ROLE, routerContractAddress);
		_mint(msg.sender, 200000000000000000000000);
    }
}
