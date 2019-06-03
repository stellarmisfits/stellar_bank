const express = require('express')
const axios = require('axios')

const queries = require('./queries') 
const stellar_utils = require('./stellar_utils')

const api = express.Router()

api.post('/register', async (req, res) => {
  console.log('/register')
  const {token, email, publicKey} = req.body;

  // TODO: can fail
  const result = await queries.getUserByEmailAndToken(email, token)

  if (!result) {
    console.log('error DB');
    return res.status(500).send('DB error')
  }

  if (result.rows.length !== 0) {
    console.log('Already registered');
    return res.status(201).send('Account already registered to that token')
  }
  
  // check if token exists
  let issuerPubk
  try {
    issuerPubk = await queries.getIssuerByToken(token)
  }
  catch (error) {

  }
  if (!issuerPubk) {
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
      console.log('/api/validate');
      const {status, data} = response
      if (status !== 200) {
        return res.status(status).send(data)
      }
      console.log(`Status: ${response.status}, ${response.data}`);
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).send('Something went wrong')
    })

  // send issuerPubk so investor can create trustline
  return res.status(200).send(issuerPubk)
})

// TODO:
api.post('/authorize', async (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/freeze', async (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/unfreeze', async (req, res) => {
  res.status(501).send('Not implemented function: unfreeze')
})

module.exports = api