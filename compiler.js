const { app } = require('electron');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2]; // Get file path from command-line argument

if (!filePath) {
    console.error('❌ Error: No Solidity file path provided.');
    process.exit(1);
}

app.whenReady().then(() => {
    const fileDir = path.dirname(filePath);
    const contractName = path.basename(filePath, '.sol'); // Get contract name
    const contractDir = path.join(fileDir, contractName); // Create a directory for compiled output

    console.log(`🔍 Compiling Solidity File: ${filePath}`);

    try {
        const source = fs.readFileSync(filePath, 'utf8');

        // Import Resolver for OpenZeppelin and other dependencies
        function findImports(importPath) {
            try {
                const openZeppelinPath = path.join(__dirname, 'node_modules', importPath);
                if (fs.existsSync(openZeppelinPath)) {
                    return { contents: fs.readFileSync(openZeppelinPath, 'utf8') };
                }
                return { error: `❌ Import not found: ${importPath}` };
            } catch (err) {
                return { error: `❌ Failed to resolve import: ${importPath}` };
            }
        }

        const input = {
            language: 'Solidity',
            sources: { [contractName]: { content: source } },
            settings: {
                outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } }
            }
        };

        // Compile with Import Resolver
        const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

        if (output.errors) {
            console.error(`❌ Compilation Errors: ${JSON.stringify(output.errors, null, 2)}`);
            process.exit(1);
        }

        if (!output.contracts || !output.contracts[contractName]) {
            console.error(`❌ Compilation failed. No contract found.`);
            process.exit(1);
        }

        const contractKey = Object.keys(output.contracts[contractName])[0];

        if (!contractKey) {
            console.error('❌ Error: No contract found.');
            process.exit(1);
        }

        const abi = output.contracts[contractName][contractKey].abi;
        const bytecode = output.contracts[contractName][contractKey].evm.bytecode.object;

        // ✅ Create contract-specific folder if it doesn't exist
        if (!fs.existsSync(contractDir)) {
            fs.mkdirSync(contractDir, { recursive: true });
        }

        const abiFilePath = path.join(contractDir, `${contractName}ABI.json`);
        const bytecodeFilePath = path.join(contractDir, `${contractName}Bytecode.txt`);

        fs.writeFileSync(abiFilePath, JSON.stringify(abi, null, 2));
        fs.writeFileSync(bytecodeFilePath, bytecode);

        console.log(`✅ Compilation successful!`);
        console.log(`📂 Compiled files saved to: ${contractDir}`);
        console.log(`📁 ABI saved to: ${abiFilePath}`);
        console.log(`📁 Bytecode saved to: ${bytecodeFilePath}`);

    } catch (error) {
        console.error(`❌ Compilation error: ${error}`);
    }

    app.quit();
});
