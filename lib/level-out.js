var levelup = require('levelup')
var db;
var evalString = process.argv[3] || 'data';
var evalResult;

db = levelup(process.argv[2], {createIfMissing: false}, function (err, db) {
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
