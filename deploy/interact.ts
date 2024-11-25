import * as hre from "hardhat";
import { ethers } from "ethers";
import { getWallet } from "./utils";

// Address of the contract to interact with
const CONTRACT_ADDRESS = "";
const CONTRACT_NAME = "Counter";

if (!CONTRACT_NAME) throw "⛔️ Provide name of the contract to interact with!";
if (!CONTRACT_ADDRESS)
  throw "⛔️ Provide address of the contract to interact with!";

// An example of a script to interact with the contract
export default async function () {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Load compiled contract info
  const contractArtifact = await hre.artifacts.readArtifact(CONTRACT_NAME);

  // Initialize contract instance for interaction
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    getWallet() // Interact with the contract on behalf of this wallet
  );

  async function increment() {
    // Increment the counter
    console.log("Calling increment...");
    const incrementTx = await contract.increment();
    console.log("Tx hash:", incrementTx.hash);
    await incrementTx.wait();
    console.log("Incremented!");
  }
  async function decrement() {
    // Decrement the counter
    console.log("Calling decrement...");
    const decrementTx = await contract.decrement();
    console.log("Tx hash:", decrementTx.hash);
    await decrementTx.wait();
    console.log("Decremented!");
  }

  async function fetchStoredInteger() {
    // Fetch the current stored integer
    console.log("Calling getCount...");
    const currentStoredInteger = await contract.getCount();
    console.log(`Count: ${currentStoredInteger}`);
  }

  //   listen to events-
  contract.on("CountUpdated", (newValue) => {
    console.log(`Event - CountUpdated: ${newValue}`);
  });

  await increment();
  await increment();
  await decrement();
  await fetchStoredInteger();
}
