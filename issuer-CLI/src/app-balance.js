const program = require('commander');

program
  .option('-t, --token <name>', 'token name')
  .parse(process.argv);

if (!program.token) 
  throw new Error('--token arg required')
  
console.log('not implemented');