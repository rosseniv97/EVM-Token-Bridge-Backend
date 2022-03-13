// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract APT is ERC20PresetMinterPauser {

	constructor() ERC20PresetMinterPauser("AppleToken", "APT") {
		super.mint(address(this), 200000);
	}

}