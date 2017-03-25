const program = require('commander');
const parse = require('csv').parse;
const fs = require('fs');
const lib = require('./broadcastHelper.js');

module.exports = {
  main () {
    program
      .version('1.0.0')
      .option('-l, --list [list]', 'list of customers in CSV file')
      .parse(process.argv);

    if (!program.list) {
      throw new Error('You need to input the email recipients file directory.');
    }

    fs.createReadStream(program.list)
      .pipe(parse({ delimiter : ',' }))
      .on('error', function(err) { return console.error(err.message); })
      .on('data', lib.addContact)
      .on("end", lib.receiveAndSendEmail);
  }
};