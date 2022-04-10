//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

//Generic router
contract Router is Ownable {
    // Generic ERC20
    ERC20 public nativeToken;
    ERC20PresetMinterPauser wrappedTokenInstance;
    mapping(address => address) public nativeToWrapped;
    mapping(address => mapping(address => uint256)) public userToLocked;

    event TokenLocked(address sender, uint256 amount, address tokenContractAddress);

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
    event TokenReleased(
        address receiverAddress,
        address nativeTokenAddress,
        uint256 amount
    );

    // tokenContract.approve(routerAddress, amount) from the FE
    function lock(address tokenContractAddress, uint256 amount) public {
        require(amount > 0, "At least 1 nativeToken needs to be locked");
        nativeToken = ERC20(tokenContractAddress);
        nativeToken.transferFrom(msg.sender, address(this), amount);
        uint256 currentAmount = userToLocked[msg.sender][tokenContractAddress];
        userToLocked[msg.sender][tokenContractAddress] = currentAmount + amount;
        emit TokenLocked(msg.sender, amount, tokenContractAddress);
    }

    // change wallet's network to the target chain on TokenLocked
    function claim(
        address receiverAddress,
        address tokenContractAddress,
        uint256 amount
    ) public {
        address wrappedTokenAddress = nativeToWrapped[tokenContractAddress];

        if (wrappedTokenAddress != address(0)) {
            wrappedTokenInstance = ERC20PresetMinterPauser(wrappedTokenAddress);
        } else {
            wrappedTokenInstance = new ERC20PresetMinterPauser(
                "wrappedToken",
                "wT"
            );
            nativeToWrapped[tokenContractAddress] = address(
                wrappedTokenInstance
            );
        }
        wrappedTokenInstance.mint(receiverAddress, amount);

        emit TokenClaimed(receiverAddress, amount, wrappedTokenAddress);
    }

    // wrappedTokenContract.approve(routerAddress, amount) from the FE
    function burn(
        address wrappedTokenAddress,
        address nativeTokenAddress,
        uint256 amount
    ) public {
        require(
            nativeToWrapped[nativeTokenAddress] == wrappedTokenAddress,
            "The bridge hasn't minted this wrapped nativeToken"
        );
        wrappedTokenInstance = ERC20PresetMinterPauser(wrappedTokenAddress);
        wrappedTokenInstance.transferFrom(msg.sender, address(this), amount);
        wrappedTokenInstance.burn(amount);

        emit TokenBurned(msg.sender, amount, nativeTokenAddress);
    }

    // switch wallet's network to the source chain on TokenBurned
    function release(
        address nativeTokenAddress,
        address receiverAddress,
        uint256 amount
    ) public {
        require(amount > 0, "At least 1 APT needs to be released");
        nativeToken = ERC20(nativeTokenAddress);
        nativeToken.transferFrom(address(this), receiverAddress, amount);
        uint256 currentAmount = userToLocked[msg.sender][nativeTokenAddress];
        userToLocked[msg.sender][nativeTokenAddress] = currentAmount - amount;
        emit TokenReleased(receiverAddress, nativeTokenAddress, amount);
    }
}
