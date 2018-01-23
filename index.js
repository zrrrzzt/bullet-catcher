const Gun = require('gun/gun')
const isFn = require('is-fn')

// Add listener
Gun.on('opt', function (context) {
  if (context.once) {
    return
  }
  // Pass to subsequent opt handlers
  this.to.next(context)

  const { isValid } = context.opt

  if (!isValid) {
    throw new Error('you must pass in an isValid function')
  }

  if (!isFn(isValid)) {
    throw new Error('isValid must be a function')
  }

  // Check all incoming traffic
  context.on('in', function (msg) {
    var to = this.to
    // restrict put
    if (msg.put) {
      if (isValid(msg)) {
        to.next(msg)
      }
    } else {
      to.next(msg)
    }
  })
})

module.exports = Gun
