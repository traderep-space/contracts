import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: process.env.RPC_URL_MUMBAI || "",
      accounts:
        process.env.PRIVATE_KEY_MUMBAI !== undefined
          ? [process.env.PRIVATE_KEY_MUMBAI]
          : [],
    },
    polygon: {
      url: process.env.RPC_URL_POLYGON || "",
      accounts:
        process.env.PRIVATE_KEY_POLYGON !== undefined
          ? [process.env.PRIVATE_KEY_POLYGON]
          : [],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.ETHERSCAN_API_KEY_MUMBAI || "",
      polygon: process.env.ETHERSCAN_API_KEY_POLYGON || "",
    },
  },
};

export default config;
