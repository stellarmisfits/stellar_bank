#!/usr/bin/env node

'use strict'

const program = require('commander')
program
  .version('0.0.1')
  .description('Fake package manager')
  .command('create-account', 'create Stellar account').alias('c')
  .command('trustIssuer', 'register to ICO').alias('i')
  .command('register', 'register to ICO').alias('r')
  .command('balance', 'get asset balance').alias('b')
  .command('transfer', 'transfer funds to other account').alias('t')
  .command('place-offer', 'place offer in Stellar order book').alias('o')
  .parse(process.argv);