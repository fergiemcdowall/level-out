var cmdr = require('commander')
var level = require('level')
var JSONStream = require('JSONStream')
var args = process.argv
if (args.length <= 2) {
  args.push('-h')
}

cmdr
  .version(require('../package.json').version)
  .usage('<databaseName> [options]')
  .option('-a, --array', 'format output as an Array')
  .option('-k, --key [value]', 'specify a key')
  .option('-g, --gte [value]', 'specify start of a key range')
  .option('-l, --lte [value]', 'specify end of a key range')
  .parse(args)

if (cmdr.key) {
  level(cmdr.args[0], {createIfMissing: false}, function (err, db) {
    if (err) {
      return console.error(err)
    }
    db.get(cmdr.key, function (err, value) {
      if (err) return console.error(err)
      // return console.log(JSON.stringify({key: cmdr.key, value: value}))
      return console.log({key: cmdr.key, value: value})
    })
  })
} else {
  level(cmdr.args[0], {
    createIfMissing: false,
    valueEncoding: 'json'
  }, function (err, db) {
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
        .pipe(cmdr.array
              ? JSONStream.stringify('[\n', ',\n', '\n]\n')
              : JSONStream.stringify('', '\n', '\n'))
        .on('error', function (err) {
          console.error(err)
        })
        .pipe(process.stdout)
    }
  })
}
