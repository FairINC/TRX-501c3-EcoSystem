const solc = require("solc");
const fs = require("fs");
const path = require("path");

const filePath = process.argv[2]; // Get Solidity file path from CLI

if (!filePath) {
    console.error("❌ Error: No Solidity file path provided.");
    process.exit(1);
}

const fileDir = path.dirname(filePath);
const contractName = path.basename(filePath, ".sol");
const contractDir = path.join(fileDir, contractName); // Create folder for compiled output

console.log(`🔍 Compiling Solidity File: ${filePath}`);

try {
    const source = fs.readFileSync(filePath, "utf8");

    function findImports(importPath) {
        try {
            const openZeppelinPath = path.join(__dirname, "node_modules", importPath);
            if (fs.existsSync(openZeppelinPath)) {
                return { contents: fs.readFileSync(openZeppelinPath, "utf8") };
            }
            return { error: `❌ Import not found: ${importPath}` };
        } catch (err) {
            return { error: `❌ Failed to resolve import: ${importPath}` };
        }
    }

    const input = {
        language: "Solidity",
        sources: { [contractName]: { content: source } },
        settings: {
            outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (output.errors) {
        console.error(`❌ Compilation Errors: ${JSON.stringify(output.errors, null, 2)}`);
        setInterval(() => {}, 1000); // Prevents exit to allow debugging
        return;
    }

    const contractKey = Object.keys(output.contracts[contractName])[0];

    if (!contractKey) {
        console.error("❌ Error: No contract found.");
        setInterval(() => {}, 1000);
        return;
    }

    const abi = output.contracts[contractName][contractKey].abi;
    const bytecode = output.contracts[contractName][contractKey].evm.bytecode.object;

    if (!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir, { recursive: true });
    }

    fs.writeFileSync(path.join(contractDir, `${contractName}ABI.json`), JSON.stringify(abi, null, 2));
    fs.writeFileSync(path.join(contractDir, `${contractName}Bytecode.txt`), bytecode);

    console.log(`✅ Compilation successful! Files saved to: ${contractDir}`);
} catch (error) {
    console.error(`❌ Compilation error: ${error}`);
    setInterval(() => {}, 1000); // Prevents immediate exit
}
