const express = require("express");
const { TronWeb } = require("tronweb");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.get("/get-abi", async (req, res) => {
    try {
        const { folderPath } = req.query;
        if (!folderPath || !fs.existsSync(folderPath)) {
            return res.status(400).json({ error: "Invalid compiled folder path" });
        }

        const abiFile = fs.readdirSync(folderPath).find(file => file.endsWith("ABI.json"));
        if (!abiFile) {
            return res.status(400).json({ error: "ABI file not found" });
        }

        const abi = JSON.parse(fs.readFileSync(path.join(folderPath, abiFile), "utf8"));
        res.json({ abi });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Load environment variables
const envPath = path.join(__dirname, "../.env/testprivate.txt");
if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env/testprivate.txt file is missing.");
    process.exit(1);
}

const envData = fs.readFileSync(envPath, "utf8").split("\n");
const fullNode = envData.find((line) => line.startsWith("NODE_URL="))?.split("=")[1]?.trim();
const issuerAddress = envData.find((line) => line.startsWith("TRON_WALLET="))?.split("=")[1]?.trim();

if (!fullNode || !issuerAddress) {
    console.error("❌ Missing NODE_URL or TRON_WALLET in .env/testprivate.txt");
    process.exit(1);
}

console.log("🔗 Connecting to TRON Node:", fullNode);
console.log("🔗 Using TRON Wallet Address:", issuerAddress);

// ✅ Initialize TronWeb
const tronWeb = new TronWeb({
    fullHost: fullNode
});

console.log("✅ TronWeb Initialized Successfully");

// ✅ API route to deploy smart contract
app.post("/deploy", async (req, res) => {
    try {
        const { compiledFolderPath, constructorArgs } = req.body;

        if (!compiledFolderPath || !fs.existsSync(compiledFolderPath)) {
            return res.status(400).json({ error: "Invalid compiled folder path" });
        }

        const files = fs.readdirSync(compiledFolderPath);
        const abiFile = files.find((file) => file.endsWith("ABI.json"));
        const bytecodeFile = files.find((file) => file.endsWith("Bytecode.txt"));

        if (!abiFile || !bytecodeFile) {
            return res.status(400).json({ error: "Could not find ABI.json or Bytecode.txt" });
        }

        const abi = JSON.parse(fs.readFileSync(path.join(compiledFolderPath, abiFile), "utf8"));
        const bytecode = fs.readFileSync(path.join(compiledFolderPath, bytecodeFile), "utf8").trim();

        console.log("🚀 Deploying contract...");

        // ✅ Ensure constructor arguments are parsed correctly
        const parsedArgs = constructorArgs ? JSON.parse(constructorArgs) : [];
        console.log("📜 Constructor Arguments:", parsedArgs);

        const deployedContract = await tronWeb.transactionBuilder.createSmartContract({
            abi: abi,
            bytecode: bytecode,
            feeLimit: 100_000_000, 
            callValue: 0,
            userFeePercentage: 1,
            originEnergyLimit: 10_000_000,
            parameters: parsedArgs // ✅ Pass constructor arguments here
        }, issuerAddress);

        const signedTx = await tronWeb.trx.sign(deployedContract);
        const broadcast = await tronWeb.trx.sendRawTransaction(signedTx);

        console.log("✅ Contract Deployment Broadcast Result:", broadcast);

        res.json({ success: true, contractAddress: broadcast.transaction.txID });

    } catch (error) {
        console.error("❌ Deployment failed:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Start the server
app.listen(3001, () => {
    console.log("🚀 Deployment server running on http://localhost:3001");
});
