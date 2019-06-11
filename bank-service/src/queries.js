const dbQuery = require('./db')

const selectToken = (token) => {
  const sql = `SELECT * FROM tokens WHERE name=$1`
  const params = [token]
  return dbQuery(sql, params)
}

const getUserByEmailAndToken = (email, token) => {
  const sql = `SELECT * FROM investors WHERE email=$1 AND token=$2`
  const params = [email, token]
  return dbQuery(sql, params)
}

const getIssuerByToken = (token) => {
  const sql = `SELECT pubk, seed FROM tokens AS t, bankaccounts AS ba WHERE t.name=$1 AND t.issuer = ba.pubk LIMIT 1`
  const params = [token]
  return dbQuery(sql, params)
}

const insertBankAccount = (pubk, seed, name) => {
  const sql = `INSERT INTO bankaccounts(pubk, seed, name) VALUES($1, $2, $3)`
  const params = [pubk, seed, name]
  return dbQuery(sql, params)
}

const insertToken = (token, issuerSeed, distributorSeed, amount) => {
  const sql = `INSERT INTO tokens(name, issuer, distributor, amount) VALUES($1, $2, $3, $4)`
  const params = [token, issuerSeed, distributorSeed, amount]
  return dbQuery(sql, params)
}

const updateInvestor = (email, token, pubkey, frozen) => {
//   UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;
  const sql = `UPDATE investors SET frozen = $1 WHERE email = $2 AND token = $3 AND pubk = $4`
  const params = [frozen, email, token, pubkey]
  return dbQuery(sql, params)
}


module.exports = {
  selectToken,
  getUserByEmailAndToken,
  getIssuerByToken,
  insertBankAccount,
  insertToken,
  updateInvestor,
}

// const test = () => {
//   const p = "XXXXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB"
//   const s = "XXXX6USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7"
//   return writeAccount(p, s, "tomo")
// }

// const test3 = () => {
//   const p = "SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7"
//   const s = "GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB"
//   return insertToken('FUUUUN', p, s, 1000)
// }


// live erro check
const test2 = () => {
  console.log('dupa')
  const sql = `SELECT issuer FROM tokens where name='DUPA'`
  const params = []
  return dbQuery(sql, params)
}


// test2()
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => {
//     console.log(err)
//   })
// test2()
