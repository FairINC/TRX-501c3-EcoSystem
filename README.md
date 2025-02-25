# Nonprofit Coin Ecosystem 🌍💡  

**The Main Ecosystem for All Nonprofit Coins**  

This repository hosts the foundational ecosystem for nonprofit-focused blockchain projects. Each participating nonprofit operates its own private ecosystem under the umbrella of **Nonprofit Coin**, supporting various decentralized functionalities, including:  

- ✅ **Token Swapping**  
- ✅ **Event Ticketing**  
- ✅ **NFT Marketplace**  
- ✅ **Decentralized Voting & Governance**  
- ✅ **Staking & Rewards**  

---

## 🏛 About Nonprofit Coin  

Nonprofit Coin serves as the **general governance token** for all nonprofit organizations within the ecosystem. Each nonprofit can issue its own dedicated token, but all tokens inherently hold **zero monetary value** and serve solely as governance votes.  

### 🔍 **501(c)(3) Compliance & Verification**  
To ensure legitimacy, all nonprofit tokens must undergo **automated 501(c)(3) verification** via the **Nonprofit 501(c)(3) Smart App**:  

- Verification occurs **at creation** and is **checked monthly** to maintain compliance.  
- Nonprofits failing compliance will have their tokens deactivated until resolved.  

---

## 💰 Tokenomics & Staking  

Each Nonprofit Coin is **pegged 1:1 with TRX**, with the following staking mechanism:  

1. **95% of staked TRX** is returned to the owner in the form of **Nonprofit Coin** or an individual **nonprofit-specific token**, depending on the staking preference.  
2. **5% of staked TRX** is allocated to the **Nonprofit Coin Surplus Wallet**, ensuring long-term sustainability and equitable redistribution.  
3. **Surplus funds** are automatically distributed **monthly** across compliant nonprofits.  
4. **The Surplus Wallet is immutable**, with keys destroyed after setup, ensuring a fair and transparent distribution process.  

---

## 🎟 **Governance & Voting**  

Holding specific nonprofit tokens unlocks:  

- **Voting rights** within that nonprofit's governance system.  
- **Unique staking benefits** determined by the nonprofit owner.  

---

## 🛠 Solidity Compiler  

To simplify the smart contract development process, we provide a **pre-configured Solidity compiler** stored in the **root directory** of this repository.  

- The compiler supports **TRON-compatible Solidity contracts**.  
- The **compilation script (`compile.js`)** allows you to select any `.sol` file and automatically generates its **ABI** and **Bytecode** in the same directory as the source file.  
- A **Windows and Linux shortcut is available** for easy access to the compiler.  

### 🔧 **How to Compile a Solidity Contract**
1. **Run the shortcut** (Windows or Linux) or execute the script manually.
2. Select your `.sol` contract file from the file explorer.
3. The script will compile the contract and save the **ABI** and **Bytecode** in the same directory as the selected file.
4. You’re ready to deploy your contract!  

---

## ⚙️ Installation & Setup  

Before running the Solidity compiler, you **must install the required dependencies**:

### **🔹 Install Node.js & Required Packages**
1. Install **[Node.js](https://nodejs.org/)** (if not already installed).
2. Install the required dependencies:
   ```sh
   npm install electron solc
   ```

---

## 📜 Batch & Shell Scripts  

Below are the **pre-configured scripts** for **Windows (`.bat`)** and **Linux (`.sh`)**.

### 🖥️ Windows: `compile.bat`  
```batch
@echo off
cd /d "D:\TRX"  <-- Update this path if necessary
npx electron compile.js
exit
```

### 📌 How to use:  
1. Save this as `compile.bat` in `D:\TRX`.  
2. **Double-click it** to launch the Solidity compiler.  

---

### 🐧 Linux: `compile.sh`  
```sh
#!/bin/bash
cd /home/user/TRX  # <-- Update this path if necessary
npx electron compile.js
```

### 📌 How to use:  
1. Save this as `compile.sh` in `/home/user/TRX`.  
2. **Make it executable**:  
   ```sh
   chmod +x /home/user/TRX/compile.sh
   ```
3. **Run it**:  
   ```sh
   ./compile.sh
   ```

---

# 📌 Setting Up a Clickable Shortcut (Windows & Linux)  

## 🖥️ Windows: Create a Desktop Shortcut  
1. **Right-click on your desktop** → Select **New > Shortcut**.  
2. Enter the location:  
   ```makefile
   D:\TRX\compile.bat
   ```
3. Click **Next**, then name it **"Compile Solidity"**.  
4. Click **Finish**.  

### 📌 To change the icon:  
- Right-click on the shortcut → **Properties** → **Change Icon**.  

---

## 🐧 Linux: Create a Desktop Launcher  

1. **Open a terminal** and create a new `.desktop` file:  
   ```sh
   nano ~/Desktop/compile-sol.desktop
   ```
2. **Paste the following content** (update paths as needed):  
   ```ini
   [Desktop Entry]
   Name=Compile Solidity
   Comment=Launch Solidity Compiler
   Exec=/bin/bash -c "/home/user/TRX/compile.sh"
   Icon=utilities-terminal
   Terminal=true
   Type=Application
   ```
   - Replace `/home/user/TRX` with the actual path to your Solidity compiler.  
   - Set `Terminal=false` if you don’t want a terminal window to stay open.  
3. **Save and exit** (`CTRL+X`, then `Y`, then `Enter`).  
4. **Make the file executable**:  
   ```sh
   chmod +x ~/Desktop/compile-sol.desktop
   ```
5. **Allow execution in the UI**:  
   - Right-click on the new shortcut.  
   - Select **Properties > Permissions**.  
   - Enable **"Allow executing file as a program"**.  

✅ **Done! Now you have a clickable icon to run the Solidity compiler on Linux.** 🚀  

---

# 🚀 Roadmap  

✔ **Phase 1:** Smart Contract Development & Audits  
✔ **Phase 2:** 501(c)(3) Verification Smart App Deployment  
🔄 **Phase 3:** Governance & Staking Platform Launch  
🔜 **Phase 4:** NFT Marketplace & Event Ticketing System  

---

# 🤝 Contributing  

We welcome contributions from **developers, nonprofits, and blockchain enthusiasts**.  
Feel free to **submit a pull request** or **open an issue** to discuss improvements.  
