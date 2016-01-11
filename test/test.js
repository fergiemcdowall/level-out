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
    '  Usage: level-out [options]',
    '\n',
    '',
    '\n',
    '  Options:',
    '\n',
    '',
    '\n',
    '    -h, --help              output usage information',
    '\n',
    '    -V, --version           output the version number',
    '\n',
    '    -d, --database [value]  the name of the leveldb',
    '\n',
    '    -k, --key [value]       specify a key',
    '\n',
    '    -g, --gte [value]       specify start of a key range',
    '\n',
    '    -l, --lte [value]       specify end of a key range',
    '\n',
    '',
    '\n',
    ''
  ]
  t.plan(50)
  noParamCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(helpLines[i], line)
    })
  })
  helpCmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line, i) {
      t.equal(helpLines[i], line)
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

test('database errors test', function (t) {
  const cmd1 = spawn('bin/level-out', ['-d'])
  const cmd2 = spawn('bin/level-out', ['-d', dbName])
  t.plan(2)
  cmd1.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: you need to specify a database]\n')
  })
  cmd2.stderr.on('data', (data) => {
    t.equal(data.toString(), '[Error: sorry I need more information]\n')
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
  const cmd1 = spawn('bin/level-out', ['-d', dbName, '-k', '2'])
  t.plan(1)
  cmd1.stdout.on('data', (data) => {
    t.equal(data.toString(), '{ key: \'2\', value: \'two\' }\n')
  })
})

test('read test for ranges', function (t) {
  const cmd = spawn('bin/level-out', ['-d', dbName, '-g', '8'])
  const stdoutLines = [
    '{ key: \'8\', value: \'eight\' }',
    '\n',
    '',
    '{ key: \'9\', value: \'nine\' }',
    '\n',
    ''
  ]
  t.plan(6)
  var i = 0
  cmd.stdout.on('data', (data) => {
    data.toString().split(/(\r?\n)/g).forEach(function (line) {
      t.equal(stdoutLines[i++], line)
    })
  })
})
