// Import necessary packages
import express, { json } from "express";
import Web3 from "web3";

// Initialize the web3 instance and connect to the Ethereum node
const web3 = new Web3("http://localhost:7545"); // Replace with your Ethereum node URL
const contractAddress = "0xef6A4C7BCf33424A96180Baa78E946bb420F1693"; // Replace with your deployed smart contract address
const contractABI = [
    {
      "constant": false,
      "inputs": [
        { "name": "patientId", "type": "uint256" },
        { "name": "note", "type": "string" }
      ],
      "name": "addAdditionalNotes",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        { "name": "patientId", "type": "uint256" }
      ],
      "name": "getPatient",
      "outputs": [
        {
          "components": [
            { "name": "id", "type": "uint256" },
            { "name": "name", "type": "string" },
            { "name": "age", "type": "uint256" },
            { "name": "sex", "type": "string" },
            { "name": "patientAddress", "type": "string" },
            { "name": "phoneNo", "type": "string" },
            { "name": "additionalNotes", "type": "string[]" }
          ],
          "name": "",
          "type": "tuple"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "doctorId", "type": "uint256" },
        { "name": "expiryTimestamp", "type": "uint256" },
        { "name": "encryptedToken", "type": "bytes32" }
      ],
      "name": "grantAccess",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "name": "patientId", "type": "uint256" },
        { "name": "name", "type": "string" },
        { "name": "age", "type": "uint256" },
        { "name": "sex", "type": "string" },
        { "name": "patientAddress", "type": "string" },
        { "name": "phoneNo", "type": "string" }
      ],
      "name": "createPatient",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  
// Initialize Express.js server
const app = express();
const PORT = process.env.PORT || 8080;

const healthRecordsContract = new web3.eth.Contract(contractABI, contractAddress);

// Middleware to parse JSON request body
app.use(json());

// Endpoint to create a new patient
app.post("/createPatient", async (req, res) => {
    const { patientId, name, age, sex, patientAddress, phoneNo } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        await healthRecordsContract.methods
            .createPatient(patientId, name, age, sex, patientAddress, phoneNo)
            .send({ from: accounts[0], gas: 3000000 });

        res.status(200).send("Patient created successfully");
    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(500).send("Error creating patient");
    }
});

app.post("/addAdditionalNotes", async (req, res) => {
    const { patientId, note } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        await healthRecordsContract.methods
            .addAdditionalNotes(patientId, note)
            .send({ from: accounts[0], gas: 3000000 });

        res.status(200).send("Additional notes added successfully");
    } catch (error) {
        console.error("Error adding additional notes:", error);
        res.status(500).send("Error adding additional notes");
    }
});
app.get("/getPatient/:patientId", async (req, res) => {
    const { patientId } = req.params;
    try {
        const patientData = await healthRecordsContract.methods.getPatient(patientId).call();
        console.log(patientData)
        if (patientData.additionalNotes.length > 1000) {
            // Optionally truncate or handle large arrays
            patientData.additionalNotes = patientData.additionalNotes.slice(0, 1000); // Example truncate logic
            console.log("first")
        }
        res.status(200).json(patientData);
    } catch (error) {
        console.error("Error getting patient record:", error);
        res.status(500).send("Error getting patient record");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
