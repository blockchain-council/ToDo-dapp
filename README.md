# ToDo-dapp
ToDo dapp Demo using Ethereum blockchain.

# Installation
1. Node.js(Version > 6.9.1)
2. Truffle: 
   - *$ npm install -g truffle*
3. TestRPC:
   - *$ npm install -g ethereumjs-testrpc*

# Running the Dapp
1. Build the npm dependencies:
    - *$ npm install*
2. Run TestRPC
    - *$ testrpc*
3. Compile the contracts
    - *$ truffle compile*
4. Deploy contracts to the Ethereum blockchain
    - *$ truffle migrate --network option*
   - Use following values in place of option:
   - development - for local test network
   - ropsten - for Ropsten test network
   - live - for Ethereum Main net
   - kovan - for Kovan test network
5. Running the Dapp
    - *$ npm run dev*
6. Open your browser and enter the following:
     - http://localhost:8080/
