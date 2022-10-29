// function deployFunc(hre) {
//     console.log("Hi!");
//     hre.getNamedAccounts();
//     hre.deployments();
// }

// module.exports.default = deployFunc;

///////OR////////

// module.exports = async hre => {
//     const { getNamedAccounts, deployments } = hre;
//     console.log("Hey!");
// };

//////////OR//////////

const { networkConfig, devChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  //Use price feed on chain where contract is deployed
  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  //Deploy minimal version for local testion

  const args = [ethUsdPriceFeedAddress];

  log("------------------------------------------------------");
  log("Deploying FundMe and awaiting confirmations...");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  });

  log(`Deployed fundMe at ${fundMe.address}`);
  log(devChains);

  if (!devChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }


  log("---------------------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
