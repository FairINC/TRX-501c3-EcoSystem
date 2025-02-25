# Nonprofit Coin (NPC) - Solidity Contract

## Overview
This smart contract implements **Nonprofit Coin (NPC)**, an ERC-20 token designed for nonprofit governance and event access. The contract is based on **OpenZeppelin's ERC-20 and Ownable** frameworks.

## Features
✅ **Initial Minting** – 4 trillion NPC tokens minted to the deployer's address.
✅ **Minting** – The owner can mint additional NPC tokens if needed.
✅ **Burning** – The owner can burn tokens to reduce supply.
✅ **Governance-Ready** – Future governance features (such as a voting contract) will allow token holders to burn tokens to vote.
✅ **Transferable** – NPC tokens can be freely transferred between users.

## Token Details
- **Token Name:** Nonprofit Coin
- **Symbol:** NPC
- **Decimals:** 18
- **Initial Supply:** 4,000,000,000,000 NPC

## Smart Contract Breakdown
### 1. **Deployment**
The contract assigns the full initial supply to the deployer:
```solidity
constructor() ERC20("Nonprofit Coin", "NPC") {
    _mint(msg.sender, INITIAL_SUPPLY);
}
```

### 2. **Minting & Burning**
- **Minting** (Owner Only):
```solidity
function mint(uint256 amount) external onlyOwner {
    _mint(msg.sender, amount);
}
```
- **Burning** (Owner Only):
```solidity
function burn(uint256 amount) external onlyOwner {
    _burn(msg.sender, amount);
}
```

### 3. **Voting (Burn to Vote - Future Feature)**
The contract supports token burning for governance voting in future implementations:
```solidity
function voteBurn(uint256 amount) external {
    require(balanceOf(msg.sender) >= amount, "Insufficient tokens to burn for voting");
    _burn(msg.sender, amount);
    // This function will be linked to a governance system in the future.
}
```

## Deployment Instructions
1. Install dependencies:
   ```sh
   npm install -g hardhat
   npm install @openzeppelin/contracts
   ```
2. Compile the contract:
   ```sh
   npx hardhat compile
   ```
3. Deploy using Hardhat:
   ```sh
   npx hardhat run scripts/deploy.js --network NETWORK_NAME
   ```

## Future Enhancements
🚀 **Ballot Contract Integration** – Implement governance functionality with **burn-to-vote** ballots.
🚀 **Multi-Owner Access** – Add role-based permissions for decentralized control.
🚀 **Snapshot Voting** – Implement governance snapshots for voting history tracking.

## Contributing
We welcome contributions from the community! Feel free to submit a pull request to improve functionality or security.

## License
This project is licensed under the **MIT License**.
