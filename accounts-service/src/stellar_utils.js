const StellarSDK = require('stellar-sdk')
const colors = require('colors')

const allowTrustLineAuth = (token, investorPubk, issuerSeed, authorize) => {
  return new Promise((resolve, reject) => {
    const issuer = StellarSDK.Keypair.fromSecret(issuerSeed)
    
    StellarSDK.Network.useTestNetwork()
    const server = new StellarSDK.Server('https://horizon-testnet.stellar.org')
    
    server.loadAccount(issuer.publicKey())
      .then((issuerAcc) => {
        const tx = new StellarSDK.TransactionBuilder(issuerAcc, {fee: 100})
          .addOperation(StellarSDK.Operation.allowTrust({
            trustor: investorPubk,
            assetCode: token,
            authorize: authorize,
            source: issuer.publicKey()
          }))
          .setTimeout(1000)
          .build()
      
      tx.sign(issuer);
      return server.submitTransaction(tx)
    })
    .then((result) => {
      resolve('OK')
    })
    .catch((error) => {
      console.log(Object.entries(error.response.data.extras.result_codes));
      reject(new Error(error))
    });
  })
}
module.exports = {
  allowTrustLineAuth,
}