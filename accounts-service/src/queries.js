const dbQuery = require('./db')

const getUserByEmail = (email) => {
  const sql = `SELECT * FROM accounts WHERE email=$1`
  const params = [email]
  return dbQuery(sql, params)
}

const getUserByEmailAndToken = (email, token) => {
  const sql = `SELECT * FROM accounts WHERE email=$1 AND token=$2`
  const params = [email, token]
  return dbQuery(sql, params)
}

module.exports = {
  getUserByEmail,
  getUserByEmailAndToken
}