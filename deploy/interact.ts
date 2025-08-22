import * as hre from "hardhat";
import { ethers } from "ethers";
import prompts from "prompts";
import fs from "fs";
import path from "path";
import { getWallet } from "./utils";

// An example of a script to interact with the contract
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
      message: "Select a compiled contract to interact with:",
      choices,
    },
    {
      type: "text",
      name: "contractAddress",
      message: "Enter the deployed contract address:",
    },
  ]);

  const { contractName, contractAddress } = response;

  if (!contractName || !contractAddress) {
    console.error("⛔️ Contract name and address are required.");
    process.exit(1);
  }

  console.log(`Running script to interact with contract ${contractAddress}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact(contractName);

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    contractAddress,
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  // Extract callable functions from ABI
  const callableFunctions = contractArtifact.abi.filter(
    (item: any) => item.type === "function" && (item.stateMutability !== "view" && item.stateMutability !== "pure")
  );

  const viewFunctions = contractArtifact.abi.filter(
    (item: any) => item.type === "function" && (item.stateMutability === "view" || item.stateMutability === "pure")
  );

  const functionChoices = callableFunctions.map((func: any) => ({
    title: func.name,
    value: func.name,
  }));

  const viewFunctionChoices = viewFunctions.map((func: any) => ({
    title: func.name,
    value: func.name,
  }));

  while (true) {
    const mainResponse = await prompts({
      type: "select",
      name: "actionType",
      message: "Select an action:",
      choices: [
        { title: "Call a function (state-changing)", value: "call" },
        { title: "Call a view/pure function (read-only)", value: "view" },
        { title: "Exit", value: "exit" },
      ],
    });

    if (mainResponse.actionType === "exit") {
      console.log("Exiting interaction script.");
      break;
    }

    if (mainResponse.actionType === "call") {
      if (functionChoices.length === 0) {
        console.log("No callable functions found in this contract.");
        continue;
      }
      const funcResponse = await prompts({
        type: "select",
        name: "functionName",
        message: "Select a function to call:",
        choices: functionChoices,
      });

      const selectedFunction = callableFunctions.find(
        (func: any) => func.name === funcResponse.functionName
      );

      if (selectedFunction) {
        const args: any[] = [];
        if (selectedFunction.inputs && selectedFunction.inputs.length > 0) {
          const argsResponse = await prompts({
            type: "text",
            name: "functionArgs",
            message: `Enter arguments for ${selectedFunction.name} (comma-separated):`,
          });
          args.push(...argsResponse.functionArgs.split(",").map((arg: string) => arg.trim()));
        }

        console.log(`Calling ${selectedFunction.name}(${args.join(", ")})...`);
        const tx = await contract[selectedFunction.name](...args);
        console.log("Tx hash:", tx.hash);
        await tx.wait();
        console.log(`${selectedFunction.name} executed!`);
      }
    } else if (mainResponse.actionType === "view") {
      if (viewFunctionChoices.length === 0) {
        console.log("No view/pure functions found in this contract.");
        continue;
      }
      const funcResponse = await prompts({
        type: "select",
        name: "functionName",
        message: "Select a view/pure function to call:",
        choices: viewFunctionChoices,
      });

      const selectedFunction = viewFunctions.find(
        (func: any) => func.name === funcResponse.functionName
      );

      if (selectedFunction) {
        const args: any[] = [];
        if (selectedFunction.inputs && selectedFunction.inputs.length > 0) {
          const argsResponse = await prompts({
            type: "text",
            name: "functionArgs",
            message: `Enter arguments for ${selectedFunction.name} (comma-separated):`,
          });
          args.push(...argsResponse.functionArgs.split(",").map((arg: string) => arg.trim()));
        }

        console.log(`Calling ${selectedFunction.name}(${args.join(", ")})...`);
        const result = await contract[selectedFunction.name](...args);
        console.log(`Result: ${result}`);
      }
    }
  }
}
