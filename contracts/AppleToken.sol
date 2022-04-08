// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract APT is ERC20PresetMinterPauser, Ownable {

	constructor() ERC20PresetMinterPauser("AppleToken", "APT") {
		_mint(msg.sender, 200000000000000000000000);
	}
}