const axios = require('axios')
const program = require('commander');
const coloros = require('colors')

program
  .option('-e, --email <email></email>')
  .option('-t, --token <name>', 'token name')
  .parse(process.argv);

if (!program.token) 
  throw new Error('--token arg required')

  if (!program.email) 
  throw new Error('--email arg required')

const {email, token} = program

axios.post(`http://localhost:3005/api/changeAccess`, { email, token, allow: true })
  .then((response) => {
    const { status, data } = response
    console.log(`Status: ${status}`)
    console.log(`Data: ${data}`)

    if (status !== 200) {
      console.log(`Error: ${data}`.red)
      process.exit()
    }

    if (status === 200) {
      console.log(`SUCCESS. Freezed user: ${email} for token: ${token}`.green)
    }
  }).catch((error) => {
    console.log(error.response.data)
    return new Error(`${error}`)
})