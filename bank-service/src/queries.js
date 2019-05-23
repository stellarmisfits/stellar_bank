const dbQuery = require('./db')

const getToken = (token) => {
  const sql = `SELECT * FROM tokens WHERE token=$1`
  const params = [token]
  return dbQuery(sql, params)
}

const createToken = (token, issuerSeed, distributorSeed, amount) => {
  const sql = `INSERT INTO tokens(token, issuerSeed, distributorSeed, amount) VALUES($1, $2, $3, $4)`
  const params = [token, issuerSeed, distributorSeed, amount]
  return dbQuery(sql, params)
}

module.exports = {
  getToken,
  createToken,
}