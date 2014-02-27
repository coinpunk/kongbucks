var Kongbucks = require('../index.js')
var assert = require('assert')

describe('seeding', function() {

  it('generates new for missing seed', function() {
    var wallet = new Kongbucks()
    
    assert.equal(wallet.seed.length, 32)
  })

  it('works with mnemonic string', function() {
    var mnemonic = 'yellow veil whole gotta defeat amaze collapse frost '+
                   'character sink shown score'
    var wallet = new Kongbucks(mnemonic)

    assert.equal('5553c6ef89714a8b16b56929f8b74d69', wallet.seed)
    assert.deepEqual(wallet.mnemonicSeed, mnemonic)
    
    assert.equal('1Mb4tKDbGdYAcdf7ZwMrHjHnXt3DMsgjE2', wallet.derivedAddress(0).toString())
    var wallet = new Kongbucks(mnemonic)
    assert.equal('1Mb4tKDbGdYAcdf7ZwMrHjHnXt3DMsgjE2', wallet.derivedAddress(0).toString())
  })

})