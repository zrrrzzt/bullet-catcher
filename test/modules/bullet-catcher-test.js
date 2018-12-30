const test = require('ava')
const Gun = require('gun/gun')
require('../../index')

test('It requires isValid to be supplied', t => {
  const error = t.throws(() => {
    const gun = Gun() // eslint-disable-line
  })
  t.is(error.message, 'you must pass in an isValid function')
})

test('It requires isValid to be a function and not a string', t => {
  const error = t.throws(() => {
    const options = {
      isValid: 'nope'
    }
    const gun = Gun(options) // eslint-disable-line
  })
  t.is(error.message, 'isValid must be a function')
})

test('It requires isValid to be a function', t => {
  const gun = Gun({
    isValid: () => {
      return true
    }
  })
  t.truthy(gun, 'Seems legit')
})
