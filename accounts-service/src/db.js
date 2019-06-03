const { Pool, Client } = require('pg')
// require('dotenv').config();
const config = require('./config')

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOSTNAME,
  database: config.DB_NAME,
  port: 5432,
  password: config.DB_PASSWORD
})

const dbQuery = (query, params, callback) => { 
  return pool.query(query, params, callback)
}

module.exports = dbQuery
