#!/usr/bin/env node

'use strict'

const program = require('commander')
program
  .version('0.0.1')
  .description('Issuer CLI')
  .command('ico', 'create Stellar token ICO').alias('i')
  .command('freeze', 'freeze token').alias('f')
  .command('unfreeze', 'unfreeze token').alias('x')
  .parse(process.argv);
