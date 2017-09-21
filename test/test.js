const dbName = 'testDB'
const levelup = require('levelup')
const spawn = require('child_process').spawn
const test = require('tape')

test('Help text test', function (t) {
  const helpCmd = spawn('bin/level-out', ['-h'])
  const noParamCmd = spawn('bin/level-out')
  const helpLines =
    ['',
      '\n',
      '  Usage: level-out <databaseName> [options]',
      '\n',
      '',
      '\n',
      '  Options:',
      '\n',
      '',
      '\n',
      '    -h, --help         output usage information',
      '\n',
      '    -V, --version      output the version number',
      '\n',
      '    -a, --array        format output as an Array',
      '\n',
      '    -k, --key [value]  specify a key',
      '\n',
      '    -g, --gte [value]  specify start of a key range',
      '\n',
      '    -l, --lte [value]  specify end of a key range',
      '\n',
      '',
      '\n',
      ''
    ]
  t.plan(50)
  noParamCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(line, helpLines[i])
    })
  })
  helpCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(line, helpLines[i])
    })
  })
})

test('version test', function (t) {
  const version = require('../package.json').version
  const cmd = spawn('bin/level-out', ['-V'])
  t.plan(1)
  cmd.stdout.on('data', (data) => {
    t.equal(data.toString(), version + '\n')
  })
})

test('make a database with levelup', function (t) {
  t.plan(1)
  levelup(dbName, {}, function (err, db) {
    var ops = [
      {type: 'put', key: '1', value: 'one'},
      {type: 'put', key: '2', value: 'two'},
      {type: 'put', key: '3', value: 'three'},
      {type: 'put', key: '4', value: 'four'},
      {type: 'put', key: '5', value: 'five'},
      {type: 'put', key: '6', value: 'six'},
      {type: 'put', key: '7', value: 'seven'},
      {type: 'put', key: '8', value: 'eight'},
      {type: 'put', key: '9', value: 'nine'}
    ]
    if (err) {
      return console.error(err)
    } else {
      db.batch(ops, function (err) {
        if (err) {
          return console.error(err)
        } else {
          t.ok(true)
          db.close()
        }
      })
    }
  })
})

test('read test', function (t) {
  const cmd1 = spawn('bin/level-out', [dbName, '-k', '2'])
  t.plan(1)
  cmd1.stdout.on('data', (data) => {
    t.equal(data.toString(), "{ key: '2', value: 'two' }\n")
  })
})

test('read test for ranges', function (t) {
  const cmd = spawn('bin/level-out', [dbName, '-g', '8'])
  const stdoutLines = [
    '{"key":"8","value":"eight"}',
    '{"key":"9","value":"nine"}'
  ]
  t.plan(2)
  var i = 0
  cmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line) {
      if (line.trim().length > 0) {
        t.equal(line, stdoutLines[i++])
      }
    })
  })
})

test('read test for ranges', function (t) {
  const cmd = spawn('bin/level-out', [dbName, '-l', '4'])
  const stdoutLines = [
    '{"key":"1","value":"one"}',
    '{"key":"2","value":"two"}',
    '{"key":"3","value":"three"}',
    '{"key":"4","value":"four"}'
  ]
  t.plan(4)
  var i = 0
  cmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line) {
      if (line.trim().length > 0) {
        t.equal(line, stdoutLines[i++])
      }
    })
  })
})

test('read test for ranges', function (t) {
  const cmd = spawn('bin/level-out', [dbName, '-l', '8', '-g', '5'])
  const stdoutLines = [
    '{"key":"5","value":"five"}',
    '{"key":"6","value":"six"}',
    '{"key":"7","value":"seven"}',
    '{"key":"8","value":"eight"}'
  ]
  t.plan(4)
  var i = 0
  cmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line) {
      if (line.trim().length > 0) {
        t.equal(line, stdoutLines[i++])
      }
    })
  })
})

test('read test for ranges', function (t) {
  const cmd = spawn('bin/level-out', [dbName])
  const stdoutLines = [
    '{"key":"1","value":"one"}',
    '{"key":"2","value":"two"}',
    '{"key":"3","value":"three"}',
    '{"key":"4","value":"four"}',
    '{"key":"5","value":"five"}',
    '{"key":"6","value":"six"}',
    '{"key":"7","value":"seven"}',
    '{"key":"8","value":"eight"}',
    '{"key":"9","value":"nine"}'
  ]
  t.plan(9)
  var i = 0
  cmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line) {
      if (line.trim().length > 0) {
        t.equal(line, stdoutLines[i++])
      }
    })
  })
})

test('read test for ranges, output as Array', function (t) {
  const cmd = spawn('bin/level-out', [dbName, '-a'])
  const expectedOutput = '[\n{"key":"1","value":"one"},\n{"key":"2","value":"two"},\n{"key":"3","value":"three"},\n{"key":"4","value":"four"},\n{"key":"5","value":"five"},\n{"key":"6","value":"six"},\n{"key":"7","value":"seven"},\n{"key":"8","value":"eight"},\n{"key":"9","value":"nine"}\n]\n'
  t.plan(1)
  var output = ''
  cmd.stdout.on('data', (data) => {
    output += data.toString()
  }).on('end', function () {
    t.looseEqual(output, expectedOutput)
  })
})
