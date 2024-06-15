const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const multer = require('multer');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

// Web3 setup to connect to Ganache
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Contract setup (replace with your contract's ABI and address from Ganache deployment)
const contractAddress = 'YOUR_CONTRACT_ADDRESS';  // Update with deployed contract address
const abi = [
    [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_patientId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_age",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_sex",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_patientAddress",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_phoneNo",
                    "type": "string"
                }
            ],
            "name": "createPatient",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "id",
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
            "name": "PatientCreated",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_patientId",
                    "type": "uint256"
                }
            ],
            "name": "getPatient",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "patientCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
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

// Function to generate JWT tokens
function generateAccessToken(patientId, doctorId, secretKey, expiryMinutes = 30) {
    const expirationTime = Math.floor(Date.now() / 1000) + (60 * expiryMinutes);
    const token = jwt.sign({ patientId, doctorId, exp: expirationTime }, secretKey);
    return token;
}

// Function to encrypt tokens
function encryptToken(token, encryptionKey) {
    const ciphertext = CryptoJS.AES.encrypt(token, encryptionKey).toString();
    return ciphertext;
}

// Function to decrypt tokens
function decryptToken(ciphertext, encryptionKey) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    const token = bytes.toString(CryptoJS.enc.Utf8);
    return token;
}

// Middleware to grant access to doctor
app.post('/grant-access', async (req, res) => {
    const { patientId, doctorId, expiryMinutes, privateKey } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;  // Secret key for signing JWT tokens
    const encryptionKey = privateKey;  // Private key provided by the client

    // Generate and encrypt token
    const token = generateAccessToken(patientId, doctorId, secretKey, expiryMinutes);
    const encryptedToken = encryptToken(token, encryptionKey);

    // Store encrypted token on the blockchain (as part of granting access logic)
    // Example logic to store encrypted token on blockchain
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

// Middleware to append data
app.post('/append-data', async (req, res) => {
    const { patientId, newData, privateKey } = req.body;
    const encryptionKey = privateKey;  // Private key provided by the client

    try {
        // Decrypt and validate token
        const encryptedToken = req.body.encryptedToken;  // Encrypted token received from client
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
