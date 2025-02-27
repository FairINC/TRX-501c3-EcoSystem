const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ------------------------------
// ✅ Compile Solidity File
// ------------------------------
app.post('/compile', (req, res) => {
    const { filePath } = req.body;

    if (!filePath) {
        return res.status(400).json({ error: 'No Solidity file path provided.' });
    }

    console.log(`🔍 Compiling Solidity File: ${filePath}`);

    exec(`node src/compiler.js "${filePath}"`, (error, stdout, stderr) => {
        let response = "";

        if (error) {
            response += `❌ Execution error: ${error.message}\n`;
        }
        if (stderr) {
            response += `⚠️ Compiler warnings/errors: ${stderr}\n`;
        }

        response += `📜 Compilation Output:\n${stdout}`;
        res.json({ output: response });
    });
});

// ------------------------------
// ✅ Save Solidity File from GitHub
// ------------------------------
app.post('/saveContract', (req, res) => {
    const { contractName, contractCode } = req.body;

    if (!contractName || !contractCode) {
        return res.status(400).json({ error: 'Missing contract name or code.' });
    }

    const savePath = path.join(__dirname, '../contracts', contractName);

    fs.writeFile(savePath, contractCode, (err) => {
        if (err) {
            console.error(`❌ Error saving contract: ${err.message}`);
            return res.status(500).json({ error: `Error saving contract: ${err.message}` });
        }

        console.log(`✅ Contract saved locally at: ${savePath}`);
        res.json({ success: true, filePath: savePath });
    });
});

// ------------------------------
// ✅ Get ABI for Constructor Arguments
// ------------------------------
app.get('/get-abi', (req, res) => {
    const { folderPath } = req.query;

    if (!folderPath) {
        return res.status(400).json({ error: 'No compiled folder path provided.' });
    }

    try {
        const files = fs.readdirSync(folderPath);
        const abiFile = files.find(file => file.endsWith('ABI.json'));

        if (!abiFile) {
            return res.status(400).json({ error: 'ABI file not found in the selected folder.' });
        }

        const abiPath = path.join(folderPath, abiFile);
        const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

        res.json({ abi });
    } catch (error) {
        console.error(`❌ Error reading ABI file: ${error.message}`);
        res.status(500).json({ error: `Error reading ABI: ${error.message}` });
    }
});

// ------------------------------
// ✅ Server Status Route
// ------------------------------
app.get('/', (req, res) => {
    res.send('🚀 Solidity Compiler API is running!');
});

// ------------------------------
// ✅ Start the Server
// ------------------------------
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
