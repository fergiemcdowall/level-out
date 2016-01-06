var cmdr = require('commander');
var levelup = require('levelup')

var evalString = process.argv[3] || 'data';
var evalResult;
var args = process.argv;
if (args.length <= 2) {args.push('-h')}

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
  .parse(args);


if (!cmdr.database || (typeof(cmdr.database) === "boolean"))
  return console.log(new Error(
    'you need to specify a database'));

if (cmdr.key) {
  levelup(cmdr.database, {createIfMissing: false}, function (err, db) {
    if (err)
      return console.log('There was a problem opening that leveldb: '
                         + err);
    db.get('foo', function (err, value) {
      if (err) return console.log('foo does not exist')
      return console.log({key: cmdr.database, value: value})
    });
  });
}

levelup(cmdr.database, {createIfMissing: false}, function (err, db) {
  if (err)
    return console.log('There was a problem opening that leveldb: ' + err);

  db.createReadStream()
    .on('data', function (data) {
      try {
        evalResult = eval(evalString);
      }
      catch (e) {
        return console.log('Your eval expression is throwing this error: ' + e);
      }
      console.log(evalResult)
    })
    .on('error', function(err) {
      console.log(err);
    });
});
