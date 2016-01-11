A simple utility for reading from a leveldb via [levelup](https://github.com/Level/levelup)

[![NPM version][npm-version-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

## Usage

Install globally with `npm install -g level-out` and then use like so:


```

  Usage: level-out [options]

  Options:

    -h, --help              output usage information
    -V, --version           output the version number
    -d, --database [value]  the name of the leveldb
    -k, --key [value]       specify a key
    -g, --gte [value]       specify start of a key range
    -l, --lte [value]       specify end of a key range

```


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/level-out
[npm-version-image]: http://img.shields.io/npm/v/level-out.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/level-out.svg?style=flat

[travis-url]: http://travis-ci.org/fergiemcdowall/level-out
[travis-image]: http://img.shields.io/travis/fergiemcdowall/level-out.svg?style=flat