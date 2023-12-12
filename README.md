# Getting Started with Create React App

Build your first decentralized application, or dApp, on the Bitcoin with this tutorial.

# Step 1. Clone the project
$ git clone //url//
# Step 2. Install dependencies
$ cd voting
$ npm install
# Step 3. Compile contract
$ npx scrypt-cli compile
# Step 4. Add your API Key
Use your own API key in file index.tsx

Scrypt.init({
  apiKey: 'YOUR_API_KEY',  // <---
  network: 'testnet'
})
# Step 5. Deploy contract
Before deploying the contract, create a .env file and save your private key in the PRIVATE_KEY environment variable.

PRIVATE_KEY=xxxxx
If you don't have a private key, please follow this guide to generate one using Sensilet wallet, then fund the private key's address with our faucet.

Run the following command to deploy the contract.

$ npm run deploy:contract
After success, you will see an output similar to the following:



Copy the deployment TxID then change the value of ContractId in file src/App.tsx:

const contract_id = {
  txId: "bccf73c0f49920fdbd2c66972b6ab14ac098239c429176acf5e599acb7dc6d4a",
  outputIndex: 0,
};
# Step 6. Run the frontend app
# React App 
$ npm start

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
