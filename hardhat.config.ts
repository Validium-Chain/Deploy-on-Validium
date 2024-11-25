import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";

import "@matterlabs/hardhat-zksync";

dotenv.config();

const { WALLET_PRIVATE_KEY = "", INFURA_API_KEY = "" } = process.env;
const VALIDIUM_DEVNET = "Validium Devnet";
const NETWORK_RPC_URLS = {
  sepolia: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
  holesky: `https://holesky.infura.io/v3/${INFURA_API_KEY}`,
  [VALIDIUM_DEVNET]: `https://devnet.l2.rpc.validium.network`,
};

const config: HardhatUserConfig = {
  defaultNetwork: VALIDIUM_DEVNET,

  zksolc: {
    version: "latest",
    compilerSource: "binary",
    settings: {},
  },
  networks: {
    sepolia: {
      url: NETWORK_RPC_URLS.sepolia,
    },
    holesky: {
      url: NETWORK_RPC_URLS.holesky,
    },
    [VALIDIUM_DEVNET]: {
      url: NETWORK_RPC_URLS[VALIDIUM_DEVNET], // L2 network RPC URL
      ethNetwork: "holesky", // Underlying Ethereum network RPC
      zksync: true, // Indicates this is a zkSync network
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
