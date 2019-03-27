const Gun = require('gun')
const isFn = require('is-fn')

// Add listener
Gun.on('opt', function (context) {
  if (context.once) {
    return
  }
  // Pass to subsequent opt handlers
  this.to.next(context)

  var { isValid } = context.opt
  var { isValidGet } = context.opt;
  var { isValidPut } = context.opt;
  isValidPut = isValid || isValidPut;
  if (!isValidPut && !isValidGet) {
    throw new Error('you must pass in an isValidPut or isValidGet function')
  }

  if ((isValidGet && !isFn(isValidGet)||(isValidPut && !isFn(isValidPut))) {
    throw new Error('isValidGet or isValidPut must be a function')
  }

  // Check all incoming traffic
  context.on('in', function (msg) {
    var to = this.to
    // restrict put
    if (msg.put) {
      if (isValidPut(msg)) {
        to.next(msg);
      }
    } else if(msg.get){
	if(isValidGet(msg)){
	 to.next(msg);
	}
    }else {
      to.next(msg)
    }
  })
})

module.exports = Gun
