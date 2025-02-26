// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SecureContractCoin
 * @dev ERC-20 token for nonprofit governance and event access with security enhancements.
 */
contract SecureContractCoin is ERC20, Ownable, Pausable, ReentrancyGuard {
    uint256 private constant INITIAL_SUPPLY = 4_000_000_000_000 * 10**18; // 4 trillion tokens
    uint256 public maxTransactionLimit; // Anti-whale mechanism

    event TokensMinted(address indexed recipient, uint256 amount);
    event TokensBurned(address indexed account, uint256 amount);
    event MaxTransactionLimitUpdated(uint256 newLimit);

    /**
     * @dev Constructor that assigns the entire initial supply to the deployer.
     */
    constructor() ERC20("Nonprofit Coin", "NPC") {
        _mint(msg.sender, INITIAL_SUPPLY);
        maxTransactionLimit = INITIAL_SUPPLY / 100; // Default: 1% of total supply
    }

    /**
     * @dev Allows the owner to set a max transaction limit.
     */
    function setMaxTransactionLimit(uint256 newLimit) external onlyOwner {
        require(newLimit > 0, "Limit must be greater than zero");
        maxTransactionLimit = newLimit;
        emit MaxTransactionLimitUpdated(newLimit);
    }

    /**
     * @dev Allows the owner to mint new tokens.
     */
    function mint(uint256 amount) external onlyOwner whenNotPaused {
        require(amount > 0, "Mint amount must be greater than zero");
        _mint(msg.sender, amount);
        emit TokensMinted(msg.sender, amount);
    }

    /**
     * @dev Allows the owner to burn tokens.
     */
    function burn(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Burn amount must be greater than zero");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Allows a user to burn tokens voluntarily (governance function).
     */
    function voteBurn(uint256 amount) external nonReentrant whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Insufficient tokens");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    /**
     * @dev Pauses all token transfers in case of an emergency.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses token transfers.
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Overrides ERC20 transfer to enforce security measures.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
        require(amount <= maxTransactionLimit, "Transfer exceeds max transaction limit");
        super._beforeTokenTransfer(from, to, amount);
    }
}