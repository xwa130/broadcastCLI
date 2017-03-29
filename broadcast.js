#!/usr/bin/env node
const main = require('./broadcastMain.js');

try {
  main();
} catch (error) {
  console.log(error);
}
