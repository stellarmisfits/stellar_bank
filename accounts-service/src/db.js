const { Pool, Client } = require('pg')
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOSTNAME,
  database: process.env.DB_NAME,
  port: 5432,
  password: process.env.DB_PASSWORD
})

const dbQuery = (query, params, callback) => { 
  return pool.query(query, params, callback)
}

module.exports = dbQuery
