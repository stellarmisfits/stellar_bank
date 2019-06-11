const express = require('express')
const catchify = require('catchify')
const axios = require('axios')
const colors = require('colors')

const stellarUtils = require('./stellar_utils')
const queries = require('./queries') 

const api = express.Router()

api.post('/ico', async (req, res) => {
  const {token, sponsorSeed, amount} = req.body;

  console.log(`Query token`.blue)
  const [errorQuery, tokenRows] = await catchify(queries.selectToken(token))
  if (errorQuery) {
    console.log('error DB'.red)
    return res.status(500).send('DB error')
  }

  if (tokenRows.rows.length !== 0) {
    console.log(`Token ${token} already exists`);
    return res.status(201).send(`Token ${token} exists`)
  }

  // create issuer
  console.log(`Creating issuer`.blue)
  const [error1, issuer] = await catchify(stellarUtils.fundAccount(`issuer${token}`, sponsorSeed))
  if (error1) {
    console.log(`Error creating issuer: ${error1}`.red);
    return res.status(501).send(error1)
  }

  // give issuer auth/revoke rights
  console.log(`Giving issuer authorization and revoke rights`.blue)
  const [errorGivingIssuerRights] = await catchify(stellarUtils.setAuthFlag(issuer.seed))
  if (errorGivingIssuerRights) {
    console.log(`Error giving issuer authorization and revoke rights: ${errorGivingIssuerRights}`.red);
    return res.status(501).send(errorGivingIssuerRights)
  }

  // create distributor
  console.log(`Creating distributor`.blue)
  const [error2, distributor] = await catchify(stellarUtils.fundAccount(`distributor${token}`, sponsorSeed))
  if (error2) {
    console.log(`Error creating distributor: ${error2}`.red);
    return res.status(501).send(error2)
  }

  // change trust line: distributor -> issuer
  console.log(`Authorizing: Change trust line (dis -> iss)`.blue)
  const [errorTrustLine] = await catchify(stellarUtils.changeTrustLineAuth(token, distributor.seed, issuer.pubk))
  if (errorTrustLine) {
    console.log(JSON.stringify(errorTrustLine))
    console.log(`Error Change trust line (dis -> iss): ${errorTrustLine}`.red)
    return res.status(501).send(errorTrustLine)
  }
  
  // allow trust line: issuer -> distributor
  console.log(`Authorizing: Allow trust line (iss -> dis)`.blue)
  const [errorAuthTrust] = await catchify(stellarUtils.allowTrustLineAuth(token, distributor.pubk, issuer.seed, true))
  if (errorAuthTrust) {
    console.log(`Error authorizing Allow trust line (iss -> dis): ${errorAuthTrust}`.red)
    return res.status(501).send(errorAuthTrust)
  }

  // insert issuer
  console.log(`Insert issuer to DB`.blue)
  const [errorInsertAcc1] = await catchify(queries.insertBankAccount(issuer.pubk, issuer.seed, issuer.name))
  if (errorInsertAcc1) {
    console.log(`Error inserting account: ${errorInsertAcc1}`);
    return res.status(501).send(errorInsertAcc1)
  }

  // insert distributor
  console.log(`Insert distributor to DB`.blue)
  const [errorInsetAcc2] = await catchify(queries.insertBankAccount(distributor.pubk, distributor.seed, distributor.name))
  if (errorInsetAcc2) {
    console.log(`Error inserting account: ${errorInsetAcc2}`.red);
    return res.status(501).send(errorInsetAcc2)
  }

  // insert token
  console.log(`Insert token to DB`.blue)
  const [errorInsertToken] = await catchify(queries.insertToken(token, issuer.pubk, distributor.pubk, amount))
  if (errorInsertToken) {
    console.log(`Error inserting token: ${errorInsertToken}`.red);
    return res.status(501).send(errorInsertToken)
  }

  console.log(`Handling request is done!`.blue)
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