const express = require('express')
const catchify = require('catchify')
const axios = require('axios')

const stellarUtils = require('../../stellar_utils')
const queries = require('./queries') 

const api = express.Router()

api.post('/ico', async (req, res) => {
  console.log(`ICO KURWA`)
  const {token, sponsorSeed, amount} = req.body;

  const [errorQuery, tokenRows] = await catchify(queries.selectToken(token))

  if (errorQuery) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (tokenRows.rows.length !== 0) {
    console.log(`Token ${token} already exists`);
    return res.status(201).send(`Token ${token} exists`)
  }

  // create issuer
  const [error1, issuer] = await catchify(stellarUtils.fundAccount(`issuer${token}`, sponsorSeed))
  if (error1) {
    console.log(`Error creating issuer: ${error1}`);
    return res.status(501).send(error1)
  }

  // create distributor
  const [error2, distributor] = await catchify(stellarUtils.fundAccount(`distributor${token}`, sponsorSeed))
  if (error2) {
    console.log(`Error creating distributor: ${error2}`);
    return res.status(501).send(error2)
  }

  // create trust line: distributor -> issuer
  const [errorTrustLine] = await catchify(stellarUtils.createTrustLine(token, distributor.seed, issuer.pubk))
  if (errorTrustLine) {
    console.log(`Error creating trusline: ${errorTrustLine}`)
    return res.status(501).send(errorTrustLine)
  }

  // authorize trust line: issuer -> distributor
  const [errorAuthTrust] = await catchify(stellarUtils.authorizeTrustLine(token, distributor.pubk, issuer.seed))
  if (errorAuthTrust) {
    console.log(`Error authorizing trusline: ${errorAuthTrust}`)
    return res.status(501).send(errorAuthTrust)
  }

  // insert issuer
  const [errorInsertAcc1] = await catchify(queries.insertBankAccount(issuer.pubk, issuer.seed, issuer.name))
  if (errorInsertAcc1) {
    console.log(`Error inserting account: ${errorInsertAcc1}`);
    return res.status(501).send(errorInsertAcc1)
  }

  // insert distributor
  const [errorInsetAcc2] = await catchify(queries.insertBankAccount(distributor.pubk, distributor.seed, distributor.name))
  if (errorInsetAcc2) {
    console.log(`Error inserting account: ${errorInsetAcc2}`);
    return res.status(501).send(errorInsetAcc2)
  }

  // insert token
  const [errorInsertToken] = await catchify(queries.insertToken(token, issuer.pubk, distributor.pubk, amount))
  if (errorInsertToken) {
    console.log(`Error inserting token: ${errorInsertToken}`);
    return res.status(501).send(errorInsertToken)
  }

  res.status(200).send(`Token ${token} created`)
})

// TODO:
api.post('/balance', async (req, res) => {
  res.status(501).send('Not implemented function: balance')
})

// TODO:
api.post('/validate_token', async (req, res) => {
  const {token} = req.body;
  const result = await queries.selectToken(token)

  if (!result) {
    console.log('error DB')
    return res.status(500).send('DB error')
  }

  if (result.rows.length === 0) {
    console.log('Token not found');
    return res.status(201).send('Token not found')
  }

  console.log('200 sending row');
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