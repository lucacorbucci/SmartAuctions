var English = artifacts.require("..contracts/English.sol");

module.exports = function(deployer) {
	deployer.deploy(English);
};
