A command line app for dumping the entire contents of a leveldb to stdout.

For maximum hacking pleasure, this module should be installed globally
like so: `npm install -g level-out`. It can then be used as a command
line utility from anywhere on your system and the output can be piped
in to any POSIX program that reads stdout (such as `grep`, `sed`,
`awk`, `less`, `cat`, and so on)


## Simple usage

On a command line type:

`level-out <location of database>`

...and get a print out of every key-value pair in the database in a
JSON format. You could for example type:

`level-out myCoolDB`

...and get:

```
{key: 1, value: "theValueForOne"}
{key: 2, value: "theValueForTwo"}
{key: 3, value: "theValueForThre"}
```

## Fancy-schmancy usage

On a command line type:

`level-out <location of database> <eval>`

...and get a print out that is formatted however you want. You could for example type:

`level-out myCoolDB "data.key + '  --  ' + data.value"`

and get a print out like this for every record in the database:

```
1  --  theValueForOne
2  --  theValueForTwo
3  --  theValueForThree
```

`<eval>` is any expression that can interpret an object called `data`,
with `key` and `value` attributes into a string.
