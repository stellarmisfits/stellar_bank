'use strict'

const fs = require('fs')
const axios = require('axios')
const program = require('commander')
const colors = require('colors')

program
  .option('-u, --username <username>', 'name of account to be created')
  .option('-t, --token <token>', 'token name')
  .parse(process.argv)

const userJSON = fs.readFileSync(`_${program.username}.json`, { encoding: 'utf-8' })
const {email, publicKey} = JSON.parse(userJSON)

// TODO: hardcoded endpoint
axios.post(`http://localhost:3001/api/register`,
  { 
    token: program.token,
    email,
    publicKey
  }).then((response) => {
    const { status, data } = response

    if (status === 201) {
      console.log(`Error: ${data}`.red)
      process.exit()
    }

    if (status === 200) {
      
    }
    // if (status !== 200) {
    //   return new Error(`Status code !== 200. response.body=${JSON.stringify(body)}`)
    // }

  }).catch((error) => {
    console.log(error)
    return new Error(`Error: ${error}`)
  })
