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

axios.post(`http://localhost:3001/api/register`, { token: program.token, email, publicKey })
  .then((response) => {
    const { status, data } = response
    console.log(`Status: ${status}`)
    console.log(`Data: ${data}`)

    if (status !== 200) {
      // todo Prmise.reject(data)
      console.log(`Error: ${data}`.red)
      process.exit()
    }

    if (status === 200) {
      console.log(`SUCCESS. ${program.token} issuer created trustline with you`.green)
    }
  }).catch((error) => {
    console.log(error.response.data)
    // return new Error(`Error: ${error}`)
})