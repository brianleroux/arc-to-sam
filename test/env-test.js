var test = require('tape')
var fs = require('fs')
var path = require('path')
var arcToSAM = require('../')

test('env', t=> {
  t.plan(1)
  t.ok(arcToSAM, 'gotta arcToSAM')
})

test('mock', t=> {
  t.plan(1)
  var pathToArc = path.join(__dirname, 'mock.arc')
  var sam = arcToSAM({pathToArc})
  t.ok(sam, 'gotta sam')
  console.log(JSON.stringify(sam, null, 2))
  fs.writeFileSync('sam.json', JSON.stringify(sam, null, 2))
})
