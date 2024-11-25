import * as hre from "hardhat";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { getWallet, verifyContract, verifyEnoughBalance } from "./utils";
import { ethers } from "ethers";

const deployContract = async (
  contractArtifactName: string,
  constructorArguments?: any[]
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
  const fullContractSource = `${artifact.sourceName}:${artifact.contractName}`;

  // Display contract deployment info
  console.log(`\n"${artifact.contractName}" was successfully deployed 🎉:`);
  console.log(` - Contract address: ${address}`);
  console.log(` - Contract source: ${fullContractSource}`);
  console.log(` - Encoded constructor arguments: ${constructorArgs}\n`);
  console.log(
    ` - See on Validium Block Explorer: https://devnet.explorer.validium.network/address/${address}\n`
  );

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
  const contractArtifactName = "Counter";
  const constructorArguments: any[] | undefined = [];
  await deployContract(contractArtifactName, constructorArguments);
}
