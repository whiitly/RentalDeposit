const RentalDeposit = artifacts.require("RentalDeposit");

module.exports = function (deployer) {
  deployer.deploy(RentalDeposit);
};