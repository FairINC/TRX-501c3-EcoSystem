const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
    res.send('🚀 Solidity Compiler API is running!');
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
