# Sablier/Flow x Polkadot

## Project description

In this project we decided to migrate [Sablier/Flow](https://github.com/sablier-labs/flow) contract on Polkadot Testnet Paseo as part of the [Polkadot Porting Existing Smart Contracts](https://ethrome25.notion.site/Prizes-and-Bounties-160d00c099af81aba88cd436e7acf94f) track of [EthRome2025](https://www.ethrome.org/).

## Comparative Analysis

Functionalities of [v1.1.1](https://github.com/sablier-labs/flow/releases/tag/v1.1.1) are entirely preserved and migrated.

## Working Deployment

### Verify FlowNFTDescriptor Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0x87BF2eE4101D93a345d1931d58Fa01e0BB0D0754

```bash
npx hardhat verify --network passet-hub 0x87BF2eE4101D93a345d1931d58Fa01e0BB0D0754
```

### Verify SablierFlow Contract

Explorer link: https://blockscout-passet-hub.parity-testnet.parity.io/address/0x4002b6408C66650FC98Cea235Ac23BAc608910fd

```bash
npx hardhat verify --network passet-hub 0x4002b6408C66650FC98Cea235Ac23BAc608910fd 0xb1bEF51ebCA01EB12001a639bDBbFF6eEcA12B9F 0x87BF2eE4101D93a345d1931d58Fa01e0BB0D0754
```

### Setup instructions

#### Install dependencies

```bash
bun install
```

#### Wallet setup

you need a wallet to deploy the contracts.

```
bun add viem --dev
bun run generate-wallet
```

Take the address in the console and use it in the [fauced](https://faucet.polkadot.io/) to get founds on Paseo testnet.

Take the private key and create a `.env` file folliwing the `.env.example` style and replace the `PRIVATE_KEY=<generated-private-key>` with the private key and `ETH_FROM=<generated-wallet-address>`.


#### Compile contract

```bash
bun hardhat:compile
```

#### Deploy

```bash
bun hardhat:deploy --network passetHub
```

