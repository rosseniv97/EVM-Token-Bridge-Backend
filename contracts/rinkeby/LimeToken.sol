// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LimeRouter.sol";

contract LMT is ERC20PresetMinterPauser, Ownable {

    constructor() ERC20PresetMinterPauser("LimeToken", "LMT") {
        _mint(msg.sender, 200000000000000000000000);
    }

    modifier onlySharedOwner() {
        require(
            msg.sender == this.owner(),
            "The router contract isn't deployed by the owner"
        );
        _;
    }

    function setupRouterRoles(
        bytes32[] memory roles,
        address routerAddress
    ) public onlySharedOwner {
        for (uint8 i = 0; i < roles.length; i++) {
            grantRole(roles[i], routerAddress);
        }
    }
}
