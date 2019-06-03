const StellarSdk = require('stellar-sdk')
const colors = require('colors')

const authorizeTrustLine = (token, investorPubk, issuerSeed) => {
  return new Promise((resolve, reject) => {
    issuer = StellarSdk.Keypair.fromSecret(issuerSeed)
    
    StellarSdk.Network.useTestNetwork()
    const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
    
    server.loadAccount(issuer.publicKey())
      .then((issuerAcc) => {
        const tx = new StellarSdk.TransactionBuilder(issuerAcc, {fee: 100})
          .addOperation(StellarSdk.Operation.allowTrust({
            trustor: investorPubk,
            assetCode: token,
            authorize: true,
            //limit: "10", // <-- omit this parameter to make is unlimited, or set it to number of tokens emitted
            source: issuer.publicKey()
          }))
          .addMemo(StellarSdk.Memo.text('Allow trust'))
          .setTimeout(1000)
          .build()
      
      tx.sign(issuer);
      return server.submitTransaction(tx)
    })
    .then((result) => {
      console.log('SUCCESSFULLY authorized trust line to investor'.green)
      resolve('OK')
    })
    .catch((error) => {
      console.error(`${error}!`.red)
      reject(new Error(error))
    });
  })
}

module.exports = {
  authorizeTrustLine,
}