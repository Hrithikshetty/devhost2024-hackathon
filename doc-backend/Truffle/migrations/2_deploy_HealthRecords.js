const HealthRecords = artifacts.require("HealthRecords");

module.exports = function (deployer) {
    deployer.deploy(HealthRecords);
};
