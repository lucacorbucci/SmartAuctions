var englishAuction = artifacts.require("englishAuction");

module.exports = function(deployer) {
	deployer.deploy(
		englishAuction,
		"titolo",
		"url",
		"1000000000000000000",
		"1000000000000000000",
		"1000000000000000000",
		"5"
	);
};
