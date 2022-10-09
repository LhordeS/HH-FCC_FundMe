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

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('Hello!');
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
}
