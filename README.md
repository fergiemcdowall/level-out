A simple utility for reading from a leveldb via [levelup](https://github.com/Level/levelup)

[![NPM version][npm-version-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

## Usage

Install globally with `npm install -g level-out` and then use like so:


```

  Usage: level-out <databaseName> [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -k, --key [value]  specify a key
    -g, --gte [value]  specify start of a key range
    -l, --lte [value]  specify end of a key range

```

To read the contents of a database, you would do something like

```bash
level-out myDBName
```

To write to and delete from a database- check out [level-in](https://www.npmjs.com/package/level-in)

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/level-out
[npm-version-image]: http://img.shields.io/npm/v/level-out.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/level-out.svg?style=flat

[travis-url]: http://travis-ci.org/fergiemcdowall/level-out
[travis-image]: http://img.shields.io/travis/fergiemcdowall/level-out.svg?style=flat