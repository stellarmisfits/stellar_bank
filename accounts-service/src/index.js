const express = require('express')
const helmet = require('helmet')

const config = require('./config')
const accountAPI = require('./api')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use('/api', accountAPI)

const port = config.uS_port || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));