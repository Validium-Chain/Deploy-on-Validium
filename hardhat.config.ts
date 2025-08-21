import dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@matterlabs/hardhat-zksync";

import chain from "./configs/chain.json";

dotenv.config();

const { WALLET_PRIVATE_KEY = "", INFURA_API_KEY = "" } = process.env;
const VALIDIUM_DEVNET = chain[0];
const HOODI_RPC_URL = `https://hoodi.infura.io/v3/${INFURA_API_KEY}`;

const { name: networkName, rpcUrls } = VALIDIUM_DEVNET;
const VALIDIUM_RPC_URL = rpcUrls.default.http[0];

const config: HardhatUserConfig = {
  defaultNetwork: networkName,
  zksolc: {
    version: "1.5.12",
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
        mode: "3",
        fallback_to_optimizing_for_size: true,
      },
      codegen: "evmla",
    },
  },
  networks: {
    hoodi: {
      url: HOODI_RPC_URL,
    },
    [networkName]: {
      url: VALIDIUM_RPC_URL, // L2 network RPC URL
      ethNetwork: "hoodi", // Underlying Ethereum network RPC
      zksync: true, // Indicates this is a zkSync network
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.24",
  },
};

export default config;
