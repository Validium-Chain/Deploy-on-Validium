# DEPLOY SMART CONTRACT ON VALIDIUM NETWORK:

1. Add these to the `.env` file:

```
WALLET_PRIVATE_KEY=
INFURA_API_KEY=
```

2. Compile all contracts inside `contracts` folder:

```
npm run compile
```

3. Deploy contract using `deploy.ts` script inside `deploy` folder:

```
npm run deploy
```

4. Copy contract address from the deployment logs and paste it to the `interact.ts` script inside `deploy` folder:
5. Run the interact script:

```
npm run interact
```

## Important Links

[Block Explorer](https://devnet.explorer.validium.network)
[Documentation](https://validium.gitbook.io/docs)
[Add Validium Network](https://validium.gitbook.io/docs/connect-to-validium)
[Faucet](https://devnet.faucet.validium.network/)
[Whitepaper](https://docsend.com/view/5c85m6dfy3v4rren)
