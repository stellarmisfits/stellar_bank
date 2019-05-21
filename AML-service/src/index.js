const express = require('express')
const helmet = require('helmet')

const config = require('./config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use('/api/validate', async (req, res) => {
  const { amount } = req.body

  if (!amount) {
    return res.status(500).send('Wrong request data: no amount field')
  }

  const compliant = config.AMLrule(amount)
  if (!compliant) {
    console.log('201, AML not compliant');
    return res.status(201).send('AML not compliant');
  }

  console.log('200, AML compliant');
  return res.status(200).send('OK') 
})

const port = config.uS_port || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));