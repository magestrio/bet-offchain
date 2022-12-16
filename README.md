# Simple off-chain server

Simple offchain server for local use. The primarely goal is to keep track of fauceted user for Bet application. Should be completed when getAction() and fetchEvents() will work on Berkeley. 

**Note:** For now, it is unsecury and unreliable.

## What is the goal?

Create an off-chain server that will interact with smart contracts, call roll up methods (methods with reducer which will send events and update on-chain state), and store data coming from events.

## How to build

```sh
tsc && node ./build/src/offchainStorage.js
```

## All repository locations:
- (UI) https://github.com/magestrio/bet-app-zk-ui
- (Smart Contracts) https://github.com/magestrio/bet-app-zk-contracts
- (Oracle) https://github.com/magestrio/bet-oracle
- (Off-chain) https://github.com/magestrio/bet-offchain

## License

[Apache-2.0](LICENSE)
