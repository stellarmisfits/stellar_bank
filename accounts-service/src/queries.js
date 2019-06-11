const dbQuery = require('./db')

const getUserByEmail = (email) => {
  const sql = `SELECT * FROM investors WHERE email=$1`
  const params = [email]
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

const insertInvestor = (email, token, pubkey, frozen) => {
  const sql = `INSERT INTO investors(email, token, pubk, frozen) VALUES($1, $2, $3, $4)`
  const params = [email, token, pubkey, frozen]
  return dbQuery(sql, params)
}

module.exports = {
  getUserByEmail,
  getUserByEmailAndToken,
  getIssuerByToken,
  insertInvestor,
}

// live error check
// const test2 = () => {
//   console.log('dupa')
//   const sql = `SELECT * FROM tokens where name='DUPA'`
//   const params = []
//   return dbQuery(sql, params)
// }


// test2()
//   .then((data) => {
//     console.log(data.rows);
//   })
//   .catch((err) => {
//     console.log(err)
//   })
