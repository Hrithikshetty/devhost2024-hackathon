import express from 'express';
import Web3 from 'web3';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' });

// Web3 setup to connect to Ganache
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Contract setup (replace with your contract's ABI and address from Ganache deployment)
const contractAddress = 'YOUR_CONTRACT_ADDRESS';  // Update with deployed contract address
const abi = [
    // Your contract ABI here
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
