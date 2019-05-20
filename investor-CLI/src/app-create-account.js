'use strict'

const fs = require('fs')
const axios = require('axios')
const program = require('commander')
const colors = require('colors')

const StellarSdk = require('stellar-sdk')

program
  .option('-u, --username <username>', 'name of account to be created')
  .option('-e, --email <email>', 'email address for account')
  .parse(process.argv)


const keyPair = StellarSdk.Keypair.random()
const publicKey = keyPair.publicKey()
const seed = keyPair.secret()
const account = { username: program.username, email: program.email }

axios.get(`https://friendbot.stellar.org?addr=${publicKey}`)
  .then((response) => {
    const { data, status } = response
    if (status !== 200) {
      return new Error(`Status code !== 200. response.body=${JSON.stringify(body)}`)
    }

    console.log(`Account name      : ${account.username}`);
    console.log(`Seed (secret key) : ${seed}`);
    console.log(`Public key        : ${publicKey}`);

    account.seed = seed;
    account.publicKey = publicKey;
    account.result = StellarSdk.xdr.TransactionResult.fromXDR(data.result_xdr, 'base64');

    fs.writeFileSync(`./_${account.username}.json`, JSON.stringify(account, null, 2) , 'utf-8');
    console.log('SUCCESS'.green);
  })
  .catch((error) => {
    return new Error(`Error: ${error}`)
  })