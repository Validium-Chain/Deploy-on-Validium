import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { ethers } from "ethers";
import prompts from "prompts";
import fs from "fs";
import path from "path";

import {
  getExplorerUrl,
  getWallet,
  verifyContract,
  verifyEnoughBalance,
} from "./utils";

const deployContract = async (
  contractArtifactName: string,
  constructorArguments?: unknown[]
) => {
  console.log(`\nStarting deployment process of "${contractArtifactName}"...`);

  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer
    .loadArtifact(contractArtifactName)
    .catch((error) => {
      if (
        error?.message?.includes(
          `Artifact for contract "${contractArtifactName}" not found.`
        )
      ) {
        console.error(error.message);
        throw `⛔️ Please make sure you have compiled your contracts or specified the correct contract name!`;
      } else {
        throw error;
      }
    });

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(
    artifact,
    constructorArguments || []
  );
  console.log(
    `Estimated deployment cost: ${ethers.formatEther(deploymentFee)} ETH`
  );

  // Check if the wallet has enough balance
  await verifyEnoughBalance(wallet, deploymentFee);

  // Deploy the contract to ZKsync
  const contract = await deployer.deploy(artifact, constructorArguments);
  const address = await contract.getAddress();
  const constructorArgs = contract.interface.encodeDeploy(constructorArguments);
  const fullContractSource = `artifacts-zk/${artifact.sourceName}:${artifact.contractName}`;
  const explorerUrl = getExplorerUrl(address);

  // Display contract deployment info
  console.log(`\n"${artifact.contractName}" was successfully deployed 🎉:`);
  console.log(` - Contract address: ${address}`);
  console.log(` - Contract source: ${fullContractSource}`);
  console.log(` - Encoded constructor arguments: ${constructorArgs}\n`);
  console.log(` - See on Validium Block Explorer: ${explorerUrl}\n`);

  if (hre.network.config.verifyURL) {
    console.log(`Requesting contract verification...`);
    await verifyContract({
      address,
      contract: fullContractSource,
      constructorArguments: constructorArgs,
      bytecode: artifact.bytecode,
    });
  }

  return contract;
};

export default async function () {
  const artifactsPath = path.join(
    __dirname,
    "..",
    "artifacts-zk",
    "contracts"
  );

  if (!fs.existsSync(artifactsPath)) {
    console.error(
      "⛔️ Error: 'artifacts-zk/contracts' directory not found. Please compile your contracts first."
    );
    process.exit(1);
  }

  const contractFiles = fs
    .readdirSync(artifactsPath)
    .filter((file) => file.endsWith(".sol"));

  if (contractFiles.length === 0) {
    console.error(
      "⛔️ Error: No compiled contract files found in 'artifacts-zk/contracts'. Please compile your contracts first."
    );
    process.exit(1);
  }

  const choices = contractFiles.map((file) => ({
    title: file,
    value: path.basename(file, ".sol"),
  }));

  const response = await prompts([
    {
      type: "select",
      name: "contractName",
      message: "Select a compiled contract to deploy:",
      choices,
    },
    {
      type: "text",
      name: "constructorArgs",
      message: "Enter the constructor arguments separated by commas (if any):",
    },
  ]);

  const { contractName, constructorArgs } = response;
  const constructorArguments = constructorArgs
    ? constructorArgs.split(",").map((arg:string) => arg.trim())
    : [];

  await deployContract(contractName, constructorArguments);
}