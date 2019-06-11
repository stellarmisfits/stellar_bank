const express = require('express')
const axios = require('axios')
const catchify = require('catchify')

const queries = require('./queries') 
const stellar_utils = require('./stellar_utils')

const api = express.Router()

api.post('/issuer', async (req, res) => {
  const { token } = req.body;

  const [queryError, queryResult] = await catchify(queries.getIssuerByToken(token))

  if (queryError) {
    console.log(queryError);
    console.log('error DB');
    return res.status(500).send('DB error')
  }

  if (!queryResult.rows) {
    console.log('No token found');
    return res.status(201).send('No token found')
  }

  const issuerSeed = queryResult.rows[0].pubk
  console.log(`Done handling /issuer request`.blue);
  return res.status(200).send(issuerSeed)
})

api.post('/register', async (req, res) => {
  console.log('handling /register request ...'.blue)
  const {token, email, publicKey} = req.body;

  console.log('check if user has already registerd'.blue)
  const [queryError, queryResult] = await catchify(queries.getUserByEmailAndToken(email, token))

  if (queryError) {
    console.log('error DB');
    console.log(queryError)
    return res.status(500).send('DB query user error')
  }

  if (queryResult.rows.length === 1) {
    console.log('Already registered');
    return res.status(201).send('Account already registered to that token')
  }
  
  // check if token exists
  console.log(`check if token ${token} exsists`.blue)
  const [queryIssuerError, queryIssuerResult] = await catchify(queries.getIssuerByToken(token))

  if (queryIssuerError) {
    console.log('error DB');
    console.log(queryIssuerError)
    return res.status(500).send('DB query issuer error')
  }

  if (queryIssuerResult.rows.length === 0) {
    console.log('Token does not exist');
    return res.status(201).send('Token does not exist')
  }

  const {seed} = queryIssuerResult.rows[0]

  // check if user complies with KYC rules
  console.log(`check KYC complience for email ${email}`.blue)
  const [errorKYC, resultKYC] = await catchify(axios.post(`http://localhost:3002/api/validate`, {email}))
  
  if (errorKYC) {
    return res.status(500).send('Something with KYC went wrong')
  }

  if (resultKYC.status !== 200) {
    return res.status(resultKYC.status).send(resultKYC.data)
  }
  console.log(`KYC result: ${resultKYC.status}, ${resultKYC.data}`.blue);
  
  // Stellar op: authorizing TrustLine
  const [authError] = await catchify(stellar_utils.allowTrustLineAuth(token, publicKey, seed, true))
  
  if (authError) {
    console.log(`Error with authorizing TrustLine issuer -> investor ${authError}`)
    return res.status(500).send('Error with authorizing TrustLine issuer -> investor')
  }
  
  // inserting investor to DB
  const [insertInvestorError] = await catchify(queries.insertInvestor(email, token, publicKey, false))
  
  if (insertInvestorError) {
    return res.status(500).send('DB error: adding investor')
  }

  return res.status(200).send('OK')
})

module.exports = api