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
        string[] additionalNotes;
    }

    mapping(uint256 => Patient) public patients;
    mapping(address => mapping(uint256 => bytes32)) public accessTokens;

    event AccessGranted(uint256 indexed patientId, uint256 indexed doctorId, uint256 expiryTimestamp, bytes32 encryptedToken);
    event PatientDataAppended(uint256 indexed patientId, string name, uint256 age, string sex, string patientAddress, string phoneNo, string[] additionalNotes);

    modifier validPatient(uint256 patientId) {
        require(bytes(patients[patientId].name).length > 0, "Patient does not exist");
        _;
    }

    function grantAccess(uint256 doctorId, uint256 expiryTimestamp, bytes32 encryptedToken) public {
        require(encryptedToken != bytes32(0), "Invalid encrypted token");
        accessTokens[msg.sender][doctorId] = encryptedToken;
        emit AccessGranted(uint256(uint160(msg.sender)), doctorId, expiryTimestamp, encryptedToken);
    }

    function createPatient(uint256 patientId, string memory name, uint256 age, string memory sex, string memory patientAddress, string memory phoneNo) public {
        require(bytes(name).length > 0 && age > 0 && bytes(sex).length > 0 && bytes(patientAddress).length > 0 && bytes(phoneNo).length > 0, "Invalid patient data");
        Patient storage newPatient = patients[patientId];
        newPatient.id = patientId;
        newPatient.name = name;
        newPatient.age = age;
        newPatient.sex = sex;
        newPatient.patientAddress = patientAddress;
        newPatient.phoneNo = phoneNo;
        emit PatientDataAppended(patientId, name, age, sex, patientAddress, phoneNo, newPatient.additionalNotes);
    }

    function addAdditionalNotes(uint256 patientId, string memory note) public validPatient(patientId) {
        require(bytes(note).length > 0, "Note cannot be empty");
        patients[patientId].additionalNotes.push(note);
        emit PatientDataAppended(patientId, patients[patientId].name, patients[patientId].age, patients[patientId].sex, patients[patientId].patientAddress, patients[patientId].phoneNo, patients[patientId].additionalNotes);
    }

    function getPatient(uint256 patientId) public view validPatient(patientId) returns (Patient memory) {
        return patients[patientId];
    }
}
