'use strict'
const StellarSdk = require('stellar-sdk');
const fs = require('fs')
const axios = require('axios')
const program = require('commander')
const colors = require('colors')

program
  .option('-u, --username <username>', 'name of account to be created')
  .option('-t, --token <token>', 'token name')
  .parse(process.argv)

if (!program.token) 
  throw new Error('--token arg required')

if (!program.username) 
  throw new Error('--username arg required')

const userJSON = fs.readFileSync(`_${program.username}.json`, { encoding: 'utf-8' })

const {email, publicKey, seed} = JSON.parse(userJSON)
const userKeys = StellarSdk.Keypair.fromSecret(seed)


axios.post(`http://localhost:3001/api/issuer`, {token: program.token})
  .then((response) => {
    const issuerPubK = response.data

    if (response.status !== 200) {
      console.log(`Error: ${issuerPubK}`.red)
      process.exit()
    }

    if (response.status === 200) {
      console.log(`Got issuers Pubk: ${issuerPubK}`.blue)
    }

    console.log(`Making request to Stellar network: creating trust you -> issuer`.blue);
    StellarSdk.Network.useTestNetwork();
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

    server.loadAccount(publicKey)
      .then((userAccount) => {
        const transaction = new StellarSdk.TransactionBuilder(userAccount, {fee: 100})
          .addOperation(StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(program.token, issuerPubK),
            source: publicKey
          }))
          .setTimeout(1000)
          .build();

        transaction.sign(userKeys);

        return server.submitTransaction(transaction);
      }).catch((error) => {
        console.log(error)
        return new Error(`Error: ${error}`.red)
      })
    })
  