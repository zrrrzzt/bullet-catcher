const Gun = require('gun/gun')
//const Gun = require('gun')
const isFn = require('is-fn')

// Add listener
Gun.on('opt', function (context) {
  if (context.once) {
    return
  }
  // Pass to subsequent opt handlers
  this.to.next(context)

  var { isValid } = context.opt;
  var { isValidGet } = context.opt
  var { isValidPut } = context.opt
  var { catcherGetKeys } = context.opt;
  isValidPut = isValid || isValidPut;
  if (!isValidGet && !isValidPut) {
    throw new Error('you must pass in an isValidPut or isValidGet function')
  }

  if ((!isFn(isValidGet)&&isValidGet)||(!isFn(isValidPut)&&isValidPut)) {
    throw new Error('isValidPut or isValidGet must be a function')
  }
   
  // Check all incoming traffic
  context.on('in', function (msg) {
    var to = this.to
    // restrict put
	console.log("Received this message",msg);
    if (msg.put) {
       var key = Object.keys(msg.put)[0];
      if(catcherPutKeys[key]){
		if(catcherPutKeys[key](msg,msg[key])){
      		 	to.next(msg);
		}
      }
      else if (isValidPut(msg)) {
        to.next(msg)
      }
    } else if(msg.get) {
       var key = msg.get["#"];
	if(catcherGetKeys[key]){
		if(catcherGetKeys[key](msg,msg["#"][key])){
      		 	to.next(msg);
		}
	}else  if(isValidGet(msg)) {
	  to.next(msg);
	}
    } else {
      to.next(msg)
    }
  })
})

module.exports = Gun
