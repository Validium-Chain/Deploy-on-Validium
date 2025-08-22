# DEPLOY SMART CONTRACT ON VALIDIUM NETWORK:

This project provides a Hardhat-based environment for deploying and interacting with smart contracts on the Validium network.

## Setup

1.  **Environment Variables:** Add the following to your `.env` file:

    ```
    WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY
    INFURA_API_KEY=YOUR_INFURA_API_KEY
    ```

2.  **Install Dependencies:** Install the project dependencies:

    ```bash
    npm install
    ```

## Usage

### 1. Compile Contracts

Compile all contracts inside the `contracts` folder:

```bash
npm run compile
```

### 2. Deploy Contract

Deploy a contract using the `deploy.ts` script:

```bash
npm run deploy
```

The script will first check for compiled contracts in the `artifacts-zk/contracts` directory. If no compiled contracts are found, it will prompt you to compile them.

If compiled contracts are found, the script will then prompt you to enter the following information:

*   **Select a compiled contract to deploy:** A list of compiled contracts will be presented for you to choose from.
*   **Constructor arguments:** A comma-separated list of arguments for the contract's constructor (if any).

### 3. Interact with Contract

Interact with a deployed contract using the `interact.ts` script:

```bash
npm run interact
```

The script will first check for compiled contracts in the `artifacts-zk/contracts` directory. If no compiled contracts are found, it will prompt you to compile them.

If compiled contracts are found, the script will then prompt you to enter the following information:

*   **Select a compiled contract to interact with:** A list of compiled contracts will be presented for you to choose from.
*   **Deployed contract address:** The address of the deployed contract you want to interact with.

After selecting the contract and providing its address, the script will enter an interactive loop. In each iteration, it will prompt you to select an action:

*   **Call a function (state-changing):** This will present a list of all state-changing functions available in the selected contract. If the chosen function requires arguments, you will be prompted to enter them as a comma-separated list. The transaction hash will be displayed, and the script will wait for the transaction to be mined.
*   **Call a view/pure function (read-only):** This will present a list of all view and pure functions available in the selected contract. If the chosen function requires arguments, you will be prompted to enter them as a comma-separated list. The return value of the function will be displayed.
*   **Exit:** This will terminate the interaction script.

## Important Links

*   [Block Explorer](https://testnet.explorer.validium.network)
*   [Documentation](https://validium.gitbook.io/docs)
*   [Add Validium Network](https://validium.gitbook.io/docs/connect-to-validium)
*   [Faucet](https://testnet.faucet.validium.network/)
*   [Whitepaper](https://docsend.com/view/5c85m6dfy3v4rren)