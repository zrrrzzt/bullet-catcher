const test = require('ava')
const pkg = require('../../package.json')
const dependencies = pkg.devDependencies || {}
const dropModules = ['nsp']
const isDropped = (module) => !dropModules.includes(module)

if (Object.keys(dependencies).length > 0) {
  Object.keys(dependencies).filter(isDropped).forEach((dependency) => {
    test(`${dependency} loads ok`, t => {
      const module = require(dependency)
      t.truthy(module)
    })
  })
} else {
  test('no dev-dependecies to test', t => {
    t.truthy(true)
  })
}
