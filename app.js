const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/****** ETHEREUM ******/
const ethConfig = require('./ethConfig.js');
const ethConnectionHelper = require('./ethConnectionHelper.js');
const web3 = ethConnectionHelper.getConnection();
const myAccount = web3.eth.accounts.privateKeyToAccount(ethConfig.ETHEREUM_ACCOUNT)

app.get(ethConfig.API_PATH, (req, res) => res.send("App is Connected and Running!"));

app.listen(ethConfig.PORT, () => console.log('App listening on port ' + ethConfig.PORT));

/****** ETHEREUM METHODS ******/

app.get(ethConfig.API_PATH + '/balance', (req, res) => {
  web3.eth.getBalance(myAccount.address).then(response => {
    let balance = web3.utils.fromWei(response, 'ether');
    res.send({balance: balance});
  });
});

app.post(ethConfig.API_PATH + '/funds', (req, res) => {
  const { recipientAcount, destinationAddress } = req.body;
  res.send();
});

app.get(ethConfig.API_PATH + '/transaction', (req, res) => {
  const { transactionhash } = req.query;
  res.send();
});
