require('dotenv').config();
const inquirer = require('inquirer');
const helper = require('sendgrid').mail;
const async = require('async');
const chalk = require('chalk');
const template = require('./template.js').template;

let questions = [
  {
    type : "input",
    name : "sender.email",
    message : "Sender's email address - "
  },
  {
    type : "input",
    name : "sender.name",
    message : "Sender's name - "
  },
  {
    type : "input",
    name : "subject",
    message : "Subject - "
  }
];
let contactList = [];

const __sendEmail = function (to, from, subject, callback) {
  let fromEmail = new helper.Email(from.email, from.name);
  let toEmail = new helper.Email(to.email, to.name);
  let body = new helper.Content("text/plain", template);
  let mail = new helper.Mail(fromEmail, subject, toEmail, body);

  let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
  let request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {
    if (error) { return callback(error); }
    callback();
  });
};

module.exports = {
  addContact (data) {
    let name = data[0] + ' ' + data[1];
    let email = data[2];
    contactList.push({ name : name, email : email });
  },

  receiveAndSendEmail () {
    inquirer.prompt(questions).then(function (ans) {
      async.each(contactList, function (recipient, fn) {
        __sendEmail(recipient, ans.sender, ans.subject, fn);
      }, function (err) {
        if (err) {
          return console.error(chalk.red(err.message));
        }
        console.log(chalk.green('Success'));
      });
    });
  }
};