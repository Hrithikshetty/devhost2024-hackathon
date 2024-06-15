const express = require('express'); // Import express using CommonJS syntax
const Web3 = require('web3'); // Import web3 using CommonJS syntax
const bodyParser = require('body-parser'); // Import body-parser using CommonJS syntax
const multer = require('multer'); // Import multer using CommonJS syntax
const dotenv = require('dotenv'); // Import dotenv using CommonJS syntax
const jwt = require('jsonwebtoken'); // Import jwt using CommonJS syntax
const crypto = require('crypto'); // Import crypto using CommonJS syntax

dotenv.config();

const app = express();
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

// Web3 setup to connect to Ganache
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

// Contract setup (replace with your contract's ABI and address from Ganache deployment)
const contractAddress = '0xef6A4C7BCf33424A96180Baa78E946bb420F1693';  // Update with deployed contract address
const abi = [
    [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "patientId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "doctorId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "expiryTimestamp",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "encryptedToken",
                    "type": "bytes32"
                }
            ],
            "name": "AccessGranted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "patientId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "age",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "sex",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "patientAddress",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "phoneNo",
                    "type": "string"
                }
            ],
            "name": "PatientDataAppended",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "patientId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "age",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "sex",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "patientAddress",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "phoneNo",
                    "type": "string"
                }
            ],
            "name": "createPatient",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "doctorId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "expiryTimestamp",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "encryptedToken",
                    "type": "bytes32"
                }
            ],
            "name": "grantAccess",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "accessTokens",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "patientId",
                    "type": "uint256"
                }
            ],
            "name": "getPatient",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "name",
                            "type": "string"
                        },
                        {
                            "internalType": "uint256",
                            "name": "age",
                            "type": "uint256"
                        },
                        {
                            "internalType": "string",
                            "name": "sex",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "patientAddress",
                            "type": "string"
                        },
                        {
                            "internalType": "string",
                            "name": "phoneNo",
                            "type": "string"
                        }
                    ],
                    "internalType": "struct HealthRecords.Patient",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "patients",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "age",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "sex",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "patientAddress",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "phoneNo",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];
const contract = new web3.eth.Contract(abi, contractAddress);

// Helper functions for token generation and encryption
const generateAccessToken = (patientId, doctorId, secretKey, expiryMinutes) => {
    return jwt.sign({ patientId, doctorId }, secretKey, { expiresIn: expiryMinutes * 60 });
};

const encryptToken = (token, encryptionKey) => {
    const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decryptToken = (encryptedToken, encryptionKey) => {
    const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
    let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Routes
app.post('/grant-access', async (req, res) => {
    const { patientId, doctorId, expiryMinutes, privateKey } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;  // Secret key for signing JWT tokens
    const encryptionKey = privateKey;  // Private key provided by the client

    // Generate and encrypt token
    const token = generateAccessToken(patientId, doctorId, secretKey, expiryMinutes);
    const encryptedToken = encryptToken(token, encryptionKey);

    // Store encrypted token on the blockchain
    const gas = await contract.methods.grantAccess(doctorId, expiryMinutes * 60, encryptedToken).estimateGas({ from: patientId });
    const tx = {
        from: patientId,
        to: contractAddress,
        gas,
        data: contract.methods.grantAccess(doctorId, expiryMinutes * 60, encryptedToken).encodeABI()
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    res.json({
        message: 'Access granted successfully',
        transactionReceipt: receipt
    });
});

app.post('/append-data', async (req, res) => {
    const { patientId, encryptedToken, newData, privateKey } = req.body;
    const encryptionKey = privateKey;  // Private key provided by the client

    try {
        // Decrypt and validate token
        const decryptedToken = decryptToken(encryptedToken, encryptionKey);
        const secretKey = process.env.JWT_SECRET_KEY;  // Secret key for verifying JWT tokens
        const validToken = jwt.verify(decryptedToken, secretKey);

        if (!validToken || validToken.doctorId !== doctorId) {
            return res.status(403).json({ error: 'Invalid or expired access token' });
        }

        // Append data to the blockchain
        const gas = await contract.methods.createPatient(newData.patientId, newData.name, newData.age, newData.sex, newData.patientAddress, newData.phoneNo).estimateGas({ from: validToken.patientId });
        const tx = {
            from: validToken.patientId,
            to: contractAddress,
            gas,
            data: contract.methods.createPatient(newData.patientId, newData.name, newData.age, newData.sex, newData.patientAddress, newData.phoneNo).encodeABI()
        };
        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

        res.json({
            message: 'Data appended successfully',
            transactionReceipt: receipt
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Failed to process request' });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
