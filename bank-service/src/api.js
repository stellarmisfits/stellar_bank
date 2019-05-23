const express = require('express')
const axios = require('axios')

const queries = require('./queries') 

const api = express.Router()

// TODO:
api.post('/ico', async (req, res) => {
  const {token, sponsorSeed, amount} = req.body;

  let result = await queries.getToken(token)

  if (!result) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (result.rows.length !== 0) {
    console.log(`Token ${token} exists`);
    return res.status(201).send(`Token ${token} exists`)
  }

  // create issuer
  // create distributor
  // create trust line: distributor -> issuer
  // authorize trust line: issuer -> distributor

  // result = await queries.create  

  res.status(501).send('Not implemented function: balances')
})

// TODO:
api.post('/balance', async (req, res) => {
  res.status(501).send('Not implemented function: balance')
  
})

// TODO:
api.post('/validate_token', async (req, res) => {
  const {token} = req.body;
  const result = await queries.getToken(token)

  if (!result) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (result.rows.length === 0) {
    console.log('Token not found');
    return res.status(201).send('Token not found')
  }

  if (result.rows[0].frozen) {
    console.log('Token frozen');
    return res.status(201).send('Token frozen')
  }

  console.log('200 OK');
  return res.status(200).send('OK')
})

// TODO:
api.post('/validate_tx', async (req, res) => {
  res.status(501).send('Not implemented function: freeze')
})

// TODO:
api.post('/validate_issuer', async (req, res) => {
  res.status(501).send('Not implemented function: unfreeze')
})


module.exports = api