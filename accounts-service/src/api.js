const express = require('express')
const axios = require('axios')

const queries = require('./queries') 

const api = express.Router()

api.post('/register', async (req, res) => {
  const {token, email, publicKey} = req.body;
  const result = await queries.getUserByEmailAndToken(email, token)

  if (!result) {
    console.log('error DB');
    return res.status(500).send('DB error')
  }

  if (result.rows.length !== 0) {
    console.log('Already registered');
    return res.status(201).send('Account already registered to that token')
  }

  // check if user complies with KYC rules
  axios.post(`http://localhost:3002/api/validate`, {email})
    .then((response) => {
      console.log(`Status: ${response.status}, ${response.data}`);
    }).catch((error) => {
      console.log(error);
      return res.status(500).send('Something went wrong')
    })
  
  // check if token exists
  axios.post(`http://localhost:3003/api/validate_token`, {token})
    .then((response) => {
      console.log(`Status: ${response.status}, ${response.data}`);
    }).catch((error) => {
      console.log(error);
      return res.status(500).send('Something went wrong')
    })


  
  // check if token is frozen
  // create trust line with distributor
})

// TODO:
api.post('/balances', (req, res) => {
  res.status(501).send('Not implemented function: balances')
  // check if email exists
  // => => => query balances
})

// TODO:
api.post('/balance', (req, res) => {
  res.status(501).send('Not implemented function: balance')
  // check if email exists
  // => => => query balance of a token
})

// TODO:
api.post('/freeze', (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/unfreeze', (req, res) => {
  res.status(501).send('Not implemented function: unfreeze')
})

module.exports = api