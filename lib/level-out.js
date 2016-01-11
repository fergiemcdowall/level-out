var cmdr = require('commander')
var levelup = require('levelup')
var args = process.argv
if (args.length <= 2) {
  args.push('-h')
}

cmdr
  .version(require('../package.json').version)
  .option('-d, --database [value]',
    'the name of the leveldb')
  .option('-k, --key [value]',
    'specify a key')
  .option('-g, --gte [value]',
    'specify start of a key range')
  .option('-l, --lte [value]',
    'specify end of a key range')
  .parse(args)

if (!cmdr.database || (typeof (cmdr.database) === 'boolean')) {
  console.error(new Error('you need to specify a database'))
} else if (cmdr.key) {
  levelup(cmdr.database, {createIfMissing: false}, function (err, db) {
    if (err) {
      return console.error(err)
    }
    db.get(cmdr.key, function (err, value) {
      if (err) return console.err(err)
      return console.log({key: cmdr.key, value: value})
    })
  })
} else if (cmdr.gte || cmdr.lte) {
  levelup(cmdr.database, {createIfMissing: false}, function (err, db) {
    if (err) {
      return console.error(err)
    } else {
      var ops = {}
      if (cmdr.gte) {
        ops.gte = cmdr.gte
      }
      if (cmdr.lte) {
        ops.lte = cmdr.lte
      }
      db.createReadStream(ops)
        .on('data', function (data) {
          return console.log(data)
        })
        .on('error', function (err) {
          console.error(err)
        })
        .on('end', function () {
        })
    }
  })
} else {
  console.error(new Error('sorry I need more information'))
}
