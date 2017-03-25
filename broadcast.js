#!/usr/bin/env node
const main = require('./broadcastMain.js').main;

try {
  main();
} catch (error) {
  console.log(error);
}
