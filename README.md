[![Build Status](https://travis-ci.org/zrrrzzt/bullet-catcher.svg?branch=master)](https://travis-ci.org/zrrrzzt/bullet-catcher)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# bullet-catcher

Restrict put on a [gun](https://github.com/amark/gun) server

This module will listen to ```in``` and run your supplied validation function against all `put` messages.

## Usage

Install `bullet-catcher` from npm

```bash
$ npm i bullet-catcher
```

Require `bullet-catcher` in your gun server

```JavaScript
const Gun = require('gun')
// MUST be required after Gun to work
require('bullet-catcher')

// This is an example validation function
function hasValidToken (msg) {
  return msg && msg && msg.headers && msg.headers.token && msg.headers.token === 'thisIsTheTokenForReals'
}

const server = require('http').createServer(Gun.serve(__dirname));

// Pass the validation function as isValid
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

## Related

- [gun-restrict-examples](https://github.com/zrrrzzt/gun-restrict-examples)

## License

[MIT](LICENSE)
