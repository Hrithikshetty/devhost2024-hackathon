// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {
    struct Patient {
        uint256 id;
        string name;
        uint256 age;
        string sex;
        string patientAddress;
        string phoneNo;
    }

    mapping(uint256 => Patient) public patients;
    mapping(address => mapping(uint256 => bytes32)) public accessTokens;

    event AccessGranted(uint256 indexed patientId, uint256 indexed doctorId, uint256 expiryTimestamp, bytes32 encryptedToken);
    event PatientDataAppended(uint256 indexed patientId, string name, uint256 age, string sex, string patientAddress, string phoneNo);

    function grantAccess(uint256 doctorId, uint256 expiryTimestamp, bytes32 encryptedToken) public {
        require(encryptedToken != bytes32(0), "Invalid encrypted token");
        accessTokens[msg.sender][doctorId] = encryptedToken;
        emit AccessGranted(uint256(uint160(msg.sender)), doctorId, expiryTimestamp, encryptedToken); // Cast address to uint256 for event
    }

    function createPatient(uint256 patientId, string memory name, uint256 age, string memory sex, string memory patientAddress, string memory phoneNo) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(age > 0, "Age must be greater than zero");
        require(bytes(sex).length > 0, "Sex cannot be empty");
        require(bytes(patientAddress).length > 0, "Address cannot be empty");
        require(bytes(phoneNo).length > 0, "Phone number cannot be empty");

        Patient memory newPatient = Patient({
            id: patientId,
            name: name,
            age: age,
            sex: sex,
            patientAddress: patientAddress,
            phoneNo: phoneNo
        });

        patients[patientId] = newPatient;
        emit PatientDataAppended(patientId, name, age, sex, patientAddress, phoneNo);
    }

    function getPatient(uint256 patientId) public view returns (Patient memory) {
        require(bytes(patients[patientId].name).length > 0, "Patient does not exist");
        return patients[patientId];
    }
}
