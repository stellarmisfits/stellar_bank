// The SDK does not have tools for creating test accounts, so you'll have to
// make your own HTTP request.
// To create a test account, send Friendbot the public key you created. It’ll create and fund 
// a new account using that public key as the account ID.
var StellarSdk = require('stellar-sdk');
var request = require('request');
var fs = require('fs');
const colors =  require('colors')

function parseArgs() {
  const args = require('commander');
  args
    .version('1.1.0')
    .option('-u, --username <username>','username of the sponsor account to be created')
    .parse(process.argv);
  
  if (typeof args.username === 'undefined') {
    args.outputHelp();
    console.error('ERR: no username given!'.red);
    process.exit(1);
  }

  return { username: args.username }
}

const createAccount = (pubk) => {
  console.log("DEBUG: pubk:" + pubk);
	return new Promise( function(resolve, reject) {

    const reqObj = {
      url: 'https://friendbot.stellar.org',
      qs: { addr: pubk },
      json: true
    }
    
    request.get(reqObj, (error, response, body) => {
			  if (error) { 
			    return reject(new Error(`error=${error.message}`));
        } 
        else if (response.statusCode !== 200) {
          const msg = 
          `error="responce status code != 200"
          response.statusCode=${response.statusCode}
          response.body='${JSON.stringify(response.body)}
          `
          return reject(new Error(msg));
        }
			  else {
			    resolve(body)
			  }
			});
		});
}

const sponsorData = parseArgs();
const keyPair = StellarSdk.Keypair.random();
// const { pubkey, privkey } = keyPair


console.log("");
console.log("## Creating sponsor account.".green);

createAccount(keyPair.publicKey())
  .then((body) => {
    console.log("Account name      : " + sponsorData.username);
    console.log("Seed (secret key) : " + keyPair.secret());
    console.log("Public key        : " + keyPair.publicKey());
    console.log("Transaction hash  : " + body.hash);
    console.log("Transaction ledger: " + body.ledger);

    sponsorData.seed   = keyPair.secret();
    sponsorData.pubk   = keyPair.publicKey();
    sponsorData.tx     = body.hash;
    sponsorData.ledger = body.ledger;
    sponsorData.result = StellarSdk.xdr.TransactionResult.fromXDR(body.result_xdr, 'base64');

    fs.writeFileSync(`./_${sponsorData.username}.json`, JSON.stringify(sponsorData, null, 2) , 'utf-8');
    console.log("SUCCESS".green);
  })
  .catch( (err) => {
    console.log(err);
    console.error('ERR: cannot create account!'.red);
    process.exit(1);
  });