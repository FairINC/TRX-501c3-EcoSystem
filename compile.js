const { app, dialog } = require('electron');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

app.whenReady().then(() => {
    dialog.showOpenDialog({
        title: "Select a Solidity File",
        filters: [{ name: "Solidity Files", extensions: ["sol"] }],
        properties: ["openFile"]
    }).then(result => {
        if (result.canceled || result.filePaths.length === 0) {
            console.error('❌ Error: No file selected.');
            app.quit();
            return;
        }

        const filePath = result.filePaths[0];
        const fileDir = path.dirname(filePath); // Get directory of the .sol file
        console.log(`🔍 Selected File: ${filePath}`);

        // Read Solidity contract
        const source = fs.readFileSync(filePath, 'utf8');

        // Create input structure for solc
        const input = {
            language: 'Solidity',
            sources: { [filePath]: { content: source } },
            settings: {
                outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } }
            }
        };

        // Compile contract
        try {
            const output = JSON.parse(solc.compile(JSON.stringify(input)));

            // Extract contract name dynamically
            const contractKey = Object.keys(output.contracts[filePath])[0];

            if (!contractKey) {
                console.error('❌ Error: No contract found in the provided file.');
                app.quit();
                return;
            }

            // Extract ABI and Bytecode
            const abi = output.contracts[filePath][contractKey].abi;
            const bytecode = output.contracts[filePath][contractKey].evm.bytecode.object;

            // Define output filenames in the same directory as the Solidity file
            const baseName = path.basename(filePath, '.sol');
            const abiFilePath = path.join(fileDir, `${baseName}ABI.json`);
            const bytecodeFilePath = path.join(fileDir, `${baseName}Bytecode.txt`);

            // Save ABI & Bytecode in the Solidity file's directory
            fs.writeFileSync(abiFilePath, JSON.stringify(abi, null, 2));
            fs.writeFileSync(bytecodeFilePath, bytecode);

            console.log(`✅ Compilation successful!`);
            console.log(`📁 ABI saved to: ${abiFilePath}`);
            console.log(`📁 Bytecode saved to: ${bytecodeFilePath}`);
        } catch (error) {
            console.error(`❌ Compilation error: ${error}`);
        }

        app.quit();
    }).catch(error => {
        console.error(`❌ File selection error: ${error}`);
        app.quit();
    });
});
