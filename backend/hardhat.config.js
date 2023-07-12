require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const globals = require("./globals");

module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "arbitrumGoerli",
  networks: {
    hardhat: { chainId: 1337 },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: [globals.PRIVATE_KEY],
    },
    arbitrumOne: {
      url: "https://arb1.arbitrum.io/rpc",
      //accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY]
    },
    /*     sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    }, */
  },
};
