const program = require('commander');

program
  .option('-t, --token <name>', 'token name')
  .parse(process.argv);

console.log(program.token);