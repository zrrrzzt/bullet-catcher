[![Build Status](https://travis-ci.org/zrrrzzt/bullet-catcher.svg?branch=master)](https://travis-ci.org/zrrrzzt/bullet-catcher)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# bullet-proof-gundb

Restrict put and get on a [gun](https://github.com/amark/gun) server. Use JSON validation on input keys, proof-of-work, or any other custom function on a per-key bases. If you only need the custom function, try using `bullet-catcher`: https://github.com/zrrrzzt/bullet-catcher. 

This module will listen to ```in``` and run your supplied validation function against all `put` and `get` messages. This module should also work in the browser. 

## Usage

Install `bullet-proof-gundb` from npm

```bash
 npm i bullet-proof-gundb
```

### bullet-proof-gundb

Require `bullet-proof-gundb` in your gun server. This is also performed by bullet-catcher. You should use `bullet-catcher` if this is all you need since it is lighter weight:

```JavaScript
const Gun = require('gun')
// MUST be required after Gun to work
require('bullet-proof-gundb')

// This is an example validation function
function hasValidToken (msg) {
  return msg && msg && msg.headers && msg.headers.token && msg.headers.token === 'thisIsTheTokenForReals'
}

const server = require('http').createServer((req, res) => {
  // filters gun requests!
  if (Gun.serve(req, res)) {
    return
  }
  require('fs').createReadStream(require('path').join(__dirname, req.url)).on('error', function () {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(require('fs')
    .readFileSync(require('path')
    .join(__dirname, 'index.html')
  ))
  }).pipe(res)
})

// Pass the PUT validation function as isValid or isValidPut
const gun = Gun({
  file: 'data.json',
  web: server,
  isValid: hasValidToken
})

// Sync everything
gun.on('out', {get: {'#': {'*': ''}}})

server.listen(8000)
```

On your client add a listener for outgoing messages and enrich them with whatever you want to validate for

```JavaScript
Gun.on('opt', function (ctx) {
  if (ctx.once) {
    return
  }
  ctx.on('out', function (msg) {
    var to = this.to
    // Adds headers for put
    msg.headers = {
      token: 'thisIsTheTokenForReals'
    }
    to.next(msg) // pass to next middleware
  })
})
```

To reduce VPS bandwidth costs, you can also restrict gets in the same way. Just specify each in the isValidPut and isValidGet functions.
```
const gun = Gun({
  file: 'data.json',
  web: server,
  isValidPut: hasValidToken,
  isValidGet: hasValidToken
})

### bullet-proof

Bullet-proof-gundb is heavier but has other options.





```
## Related

- [bullet-catcher](https://github.com/zrrrzzt/bullet-catcher)
- [gun-restrict-examples](https://github.com/zrrrzzt/gun-restrict-examples)

## License

[MIT](LICENSE)
