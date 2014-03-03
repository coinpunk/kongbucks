var Kongbucks = require('../index.js')
var assert = require('assert')

var privateKey = '5JXf6WAAS74GFjTZtpK4ypvVTHCZC5wYZpFQ42GKgJLesTnKw56'
var address    = '17r5BnSyNViJS9TPvf5BbMw8rksf9Wa5zf'
var validMnemonic = 'yellow veil whole gotta defeat amaze collapse frost '+
                    'character sink shown score'
var wallet = new Kongbucks(validMnemonic)

describe('Kongbucks', function() {
  
  it('loads with new seed', function() {
    var newWallet = new Kongbucks()
    
    assert.equal(newWallet.seed.length, 32)
    assert.notEqual(wallet.seed, newWallet.seed)
  })

  it('loads with mnemomic string', function() {
    assert.equal('5553c6ef89714a8b16b56929f8b74d69', wallet.seed)
    assert.deepEqual(wallet.mnemonicSeed, validMnemonic)
  })
  
  describe('derivedAddress', function() {
    it('provides valid address', function() {
      assert.equal('1Mb4tKDbGdYAcdf7ZwMrHjHnXt3DMsgjE2', wallet.derivedAddress(0).toString())
    })

    it('provides first testnet address', function() {
      var wallet = new Kongbucks(validMnemonic, {testnet: true})
      assert.equal('n272BNJa5eyRPk8jHWLE7eW7PsdvGo3oyG', wallet.derivedAddress(0).toString())
    })
  })
  
  describe('importPrivateKey', function() {
    it('rejects invalid key', function() {
      assert.throws(function() {
        wallet.importPrivateKey('derp')
      }, function(err) {
        if((err instanceof Error) && /Error: invalid private key/.test(err)) {
          return true
        }
      })
    })
    
    it('imports valid key', function() {
      var wallet = new Kongbucks(validMnemonic)
      var addr = wallet.importPrivateKey(privateKey)
      assert.equal(address, addr)
      assert.equal(wallet.keys[0].addr)
    })
    
    it('rejects testnet key for production', function () {
      var wallet = new Kongbucks(validMnemonic)
      
      assert.throws(function() {
        wallet.importPrivateKey('932YAbn1t6Y4dYYB1j95Tn7o6gyaGMyK1w1GPMFYBGCYYv9RnXF')
      }, function(err) {
        if((err instanceof Error) && /Error: not a valid production key/.test(err)) {
          return true
        }
      })
    })
    
    it('rejects production key for testnet', function() {
      var wallet = new Kongbucks(validMnemonic, {testnet: true})
      
      assert.throws(function() {
        wallet.importPrivateKey(privateKey)
      }, function(err) {
        if((err instanceof Error) && /Error: not a valid testnet key/.test(err)) {
          return true
        }
      })
    })
    
    it('imports testnet key', function() {
      var wallet = new Kongbucks(validMnemonic, {testnet: true})
      var addr = wallet.importPrivateKey('932YAbn1t6Y4dYYB1j95Tn7o6gyaGMyK1w1GPMFYBGCYYv9RnXF')
      assert.equal('muZErRN81VkGRU4Auos6tGdSZM2GjJcY8s', addr)
      assert.equal('932YAbn1t6Y4dYYB1j95Tn7o6gyaGMyK1w1GPMFYBGCYYv9RnXF', wallet.keys[0].key.toString())
    })
  })
  
  describe('toJson', function() {
    it('exports valid json', function() {
      var wallet = new Kongbucks(validMnemonic)
      wallet.importPrivateKey(privateKey, 'Whiffies Fried Pies')
      var json = wallet.toJson()

      assert.equal(validMnemonic, json.mnemonicSeed)
      assert.equal(privateKey, json.keys[0].key)
      assert.equal(address, json.keys[0].address)
      assert.equal('Whiffies Fried Pies', json.keys[0].label)
    })
  })
  
})