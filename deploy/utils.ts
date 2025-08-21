import dotenv from "dotenv";
import * as hre from "hardhat";
import { Provider, Wallet } from "zksync-ethers";
import { ethers } from "ethers";

import "@matterlabs/hardhat-zksync-node/dist/type-extensions";

import chain from "../configs/chain.json";

// Load env file
dotenv.config();

export const getProvider = () => {
  const rpcUrl = hre.network.config.url;
  if (!rpcUrl)
    throw `⛔️ RPC URL wasn't found in "${hre.network.name}"! Please add a "url" field to the network config in hardhat.config.ts`;

  // Initialize ZKsync Provider
  const provider = new Provider(rpcUrl);

  return provider;
};

export const getWallet = (privateKey?: string) => {
  if (!privateKey) {
    // Get wallet private key from .env file
    if (!process.env.WALLET_PRIVATE_KEY)
      throw "⛔️ Wallet private key wasn't found in .env file!";
  }

  const provider = getProvider();

  // Initialize ZKsync Wallet
  const wallet = new Wallet(
    privateKey ?? process.env.WALLET_PRIVATE_KEY!,
    provider
  );

  return wallet;
};

export const verifyEnoughBalance = async (wallet: Wallet, amount: bigint) => {
  // Check if the wallet has enough balance
  const balance = await wallet.getBalance();
  if (balance < amount)
    throw `⛔️ Wallet balance is too low! Required ${ethers.formatEther(
      amount
    )} ETH, but current ${wallet.address} balance is ${ethers.formatEther(
      balance
    )} ETH`;
};

export const verifyContract = async (data: {
  address: string;
  contract: string;
  constructorArguments: string;
  bytecode: string;
}) => {
  const verificationRequestId: number = await hre.run("verify:verify", {
    ...data,
    noCompile: true,
  });
  return verificationRequestId;
};

export const getExplorerUrl = (address: string) => {
  return `${chain[0].blockExplorers.default.url}/address/${address}`;
};

// TODO: update README.md file, make sure all the links are working and points to testnet resources.
// TODO: update it like this: to interact, user need to provide the contract address through the cli or some json file
// TODO: add colorfull cli responses
/**
 * refer these-
 * https://docs.zksync.io/zksync-era/tooling/hardhat/plugins/hardhat-zksync
 * https://docs.zksync.io/zksync-era/tooling/hardhat/plugins/hardhat-zksync-ethers
 */
