const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/****** ETHEREUM ******/
const ethConfig = require('./ethConfig.js');
const ethConnectionHelper = require('./ethConnectionHelper.js');
const web3 = ethConnectionHelper.getConnection();
const myAccount = web3.eth.accounts.privateKeyToAccount(ethConfig.ETHEREUM_ACCOUNT);
var Tx = require('ethereumjs-tx');

app.get(ethConfig.API_PATH, (req, res) => res.send("App is Connected and Running!"));

app.listen(ethConfig.PORT, () => console.log('App listening on port ' + ethConfig.PORT));

/****** ETHEREUM METHODS ******/

app.get(ethConfig.API_PATH + '/balance', (req, res) => {
  web3.eth.getBalance(myAccount.address).then(response => {
    let balance = web3.utils.fromWei(response, 'ether');
    res.send({ balance: balance });
  });
});

app.post(ethConfig.API_PATH + '/funds', (req, res) => {
  const { recipientAccount, amount } = req.body;
  web3.eth.getGasPrice()
    .then(gasPrice => {
      web3.eth.getTransactionCount(myAccount.address)
        .then(nofTransactions => {
          let rawTx = {
            nonce: web3.utils.toHex(nofTransactions),
            gas: web3.utils.toHex('21000'),
            gasPrice: web3.utils.toHex(gasPrice),
            to: recipientAccount,
            value: web3.utils.toHex(amount),
          }

          let tx = new Tx(rawTx);
          tx.sign(Buffer.from(ethConfig.ETHEREUM_PK, 'hex'));
          let serializedTx = tx.serialize();

          web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
            .on('receipt', response => {
              res.send(response);
            });
        })
    });
});

app.get(ethConfig.API_PATH + '/transaction', (req, res) => {
  const { transactionhash } = req.query;
  web3.eth.getTransaction(transactionhash)
    .then(response => {
      res.send(response);
    });
});
