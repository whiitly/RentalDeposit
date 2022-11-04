const HomeyContract = artifacts.require("HomeyContract");

module.exports = function (deployer) {
  deployer.deploy(HomeyContract);
};