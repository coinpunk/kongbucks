var bitcoin   = require('bitcoinjs-lib')
var mnemonic  = require('mnemonic')
var crypto    = require('crypto')

var Kongbucks = function(mnemonicSeed, walletFile) {
  if(mnemonicSeed) {
    this.seed = mnemonic.decode(mnemonicSeed.split(' '))
    this.mnemonicSeed = mnemonicSeed
  } else {
    // Generate a new seed
    try {
      var buf = crypto.randomBytes(16);
      this.seed = buf.toString('hex')
      this.mnemonicSeed = mnemonic.encode(this.seed)
    } catch (ex) {
      throw ex
    }
  }

  this.hd = new bitcoin.HDWallet(this.seed)
}

Kongbucks.prototype.derivedAddress = function(index) {
  var derived = this.hd.derive(index)
  return derived.getBitcoinAddress()
}

module.exports = Kongbucks