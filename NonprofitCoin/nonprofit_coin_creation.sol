// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ContractCoinCreation
 * @dev ERC-20 token for nonprofit governance and event access.
 */
contract ContractCoinCreation is ERC20, Ownable {
    uint256 private constant INITIAL_SUPPLY = 4_000_000_000_000 * 10**18; // 4 trillion tokens

    /**
     * @dev Constructor that assigns the entire initial supply to the deployer.
     */
    constructor() ERC20("Nonprofit Coin", "NPC") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Allows the owner to mint new tokens as needed.
     * @param amount The number of tokens to mint.
     */
    function mint(uint256 amount) external onlyOwner {
        _mint(msg.sender, amount);
    }

    /**
     * @dev Allows the owner to burn tokens if needed.
     * @param amount The number of tokens to burn.
     */
    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Future governance function: Ballot contract can be integrated to enable token-burning votes.
     */
    function voteBurn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient tokens to burn for voting");
        _burn(msg.sender, amount);
        // This function will be linked to a governance system in the future.
    }
}

