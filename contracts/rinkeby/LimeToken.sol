// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "../../node_modules/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "../../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./LimeRouter.sol";

contract LMT is ERC20PresetMinterPauser, Ownable {
	constructor() ERC20PresetMinterPauser("LimeToken", "LMT") {
		_mint(msg.sender, 200000000000000000000000);
	}

	modifier onlySharedOwner(LimeRouter routerContract) {
		require(routerContract.owner() == this.owner(), "The router contract isn't deployed by the owner");
		_;
	}

	function setupRole(bytes32 role, LimeRouter routerContract) public onlySharedOwner(routerContract) {
		_setupRole(role, address(routerContract));
	}

}