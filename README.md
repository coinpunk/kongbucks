# Kongbucks

A Bitcoin/altcoin wallet for node.js and the browser!

Kongbucks is a hybrid design, which implements the best of HD wallets (single seed to generate), but still provides support for importing external private keys and watch only addresses. It uses best practices for improving privacy - for example, the change for transactions is sent to special addresses with a random ordering of the outputs instead of the original address, preventing people from determining which address is change. Eventually we will have support for emerging privacy tech like stealth addresses (pull requests extremely welcome here).

When using only an HD wallet design, you can regenerate the wallet (and all of the addresses) at any time using a seed which can be presented as a mnemonic string of words, without sacrificing the strength of your seed like brain wallets do.

Eventually the idea is to make the wallet support multiple altcoins in a single wallet (litecoin, dogecoin), but that will require some code that doesn't exist yet. But we have designed the wallet with multiple currency support in mind.

The goal of this project isn't to just be a special wallet for Coinpunk - we want to make a solid base that everyone can use for wallet work, so that we don't have so much fragmentation in JS wallet design like we do right now. It probably won't work, but oh well.

## Usage

Install via npm:

    npm install kongbucks

Create a new wallet from a random seed:

    var Kongbucks = require('kongbucks')
    var wallet = new Kongbucks()
    
    console.log(wallet.getSeed())
    console.log(wallet.getMnemonicSeed())

If you're only using the seed, you can use it to regenerate the entire wallet's keys:

    var wallet = new Kongbucks('seed or mnemonic seed')

In order to use the wallet, you will first need to discover the unspent transactions for your wallet from a listener server. The listeners are modular, so that people can contribute support for more servers in the future. The wallet will work the same regardless of the listen server used, and can be changed on the fly. This example uses blockchain.info, automatically sending a list of the addresses you need to listen for unspent transactions on:

    wallet.listen({source: 'blockchain'}, function(error, result) {
      wallet.getUnspents(function() {
        wallet.getBalance()
      })
    })

To get a list of unspents in JSON form:

    wallet.currentUnspents()

To import a private key not related to the HD wallet (note: you will need to store the wallet file somewhere in order to persist if you do this!):

    wallet.addPrivateKey('private key')

You can also import an address if you would like to be able to watch it:

    wallet.addWatchOnlyAddress('watch only address', 'Donations for Coinpunk')

Exporting the wallet file for storage as unencrypted JSON:

    var walletJson = wallet.toJson()

To export with AES encryption using your seed that will work in a browser via sjcl, default 10k iterations:

    var encryptedJson = wallet.toEncryptedJson()

To export with different/stronger/custom encryption - well, roll your own.

To create a transaction but not send it (fee is automatically calculated and inserted for you):

    var rawTx = wallet.createTransaction(receivingAddress, amount)

You will then need to transmit the raw transaction, which you can do via a bitcoind client or blockchain.info. Or send it via the wallet directly:

    var rawTx = wallet.createAndSendTransaction(receivingAddress, amount, function(error, result) {
      // do stuff
    })

To estimate the minimum fee needed for a transaction with the current unspents:

    wallet.estimateTransactionFee(receivingAddress, amount)

Instantiating from an existing unencrypted wallet file:

    var fs = require('fs')
    var walletJson = fs.readFileSync('saved-wallet.json')
    var wallet = new Kongbucks('seed or mnemonic seed', encryptedOrUnencryptedWalletJson)
