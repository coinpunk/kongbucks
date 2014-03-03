var bitcoin    = require('bitcoinjs-lib')
var mnemonic   = require('mnemonic')
var crypto     = require('crypto')

var Kongbucks = function(mnemonicSeed, args) {
  var buf
  var args = args || {}

  if(args.testnet == true)
    this.testnet = true
  
  // TODO: validation of seed
  if(mnemonicSeed) {
    this.seed = mnemonic.decode(mnemonicSeed.split(' '))
    this.mnemonicSeed = mnemonicSeed
  } else {
    // Generate a new seed
    buf = crypto.randomBytes(16)
    this.seed = buf.toString('hex')
    this.mnemonicSeed = mnemonic.encode(this.seed)
  }

  this.hd = new bitcoin.HDWallet(this.seed, (this.testnet == true ? 'Test' : 'Bitcoin'))
  this.keys = []
}

Kongbucks.prototype.derivedAddress = function(index) {
  var derived = this.hd.derive(index)
  return derived.getBitcoinAddress()
}

Kongbucks.prototype.importPrivateKey = function(key, label) {
  var key = new bitcoin.ECKey(key)
  
  try {
    var address = key.getBitcoinAddress()
  } catch(ex) {
    throw new Error('invalid private key')
  }

  if(this.testnet && address.version != bitcoin.Address.address_types.testnet)
    throw new Error('not a valid testnet key')
    
  if(!this.testnet && address.version != bitcoin.Address.address_types.prod)
    throw new Error('not a valid production key')
  
  this.keys.push({
    key: key,
    address: address,
    label: label || ''
  })
  
  //console.log(address.version)
  return address
}

Kongbucks.prototype.toJson = function() {
  var keysJson = []

  this.keys.forEach(function(key) {
    keysJson.push({
      key:     key.key.toString(),
      address: key.address.toString(),
      label:   key.label
    })
  })
  
  return {
    mnemonicSeed: this.mnemonicSeed,
    keys: keysJson
  }
}

Kongbucks.prototype.setSource = function(obj) {
  this.source = obj
}

module.exports = Kongbucks