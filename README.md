# npm-draw-poc

POC for function-level dependencies.

## Usage:

Say that `https://example.com/some/url/lambda_function.js` has code:

```javascript
// a single arrow function
(x, y) => x + y
```

then, using folder `shelf` relative to execution of nodejs program:

```javascript
const cache = require('./cache-barrel')('./shelf') 
const ff = require('./draw.js')(cache) 

let path = 'https://example.com/some/url/lambda_function.js'

ff(path).then((f) => console.log('result = ' + f(3, 8)))

```

outputs: `result = 11`

## Background

Yet another [great talk by Rich Hickey](https://www.youtube.com/watch?v=oyLBGkS5ICk) gives a good overview of the problem that we have: We don't want to upgrade dependencies because they usually entail breaking changes. Often, especially for small pieces of code, developers prefer to copy or re-invent the wheel to avoid the dependency problem all togehter.

How much MB does a typical angular project have ~ do you _really_ need to download all the code, even if you only run a subset ?

Another point, there is no benefit in re-testing and re-building the same things over and over if it's execution path hasn't changed. It slows down the dev/test feedback loop.

There is a versioning convention called 'Semantic versioning':
<br/> \_.\_.x will probably not be a breaking change
<br/> \_.x.\_ also won't be a breaking change, pinky promise ;)
<br/> x.\_.\_ is more honenst : changes will possibly break your code, oops!

This is not a solution, as it only reflects the interface of a library. The behaviour changes from version to version, and sometimes even a 0.0.x bump is a breaking change anyway.

What we want is a way to re-use code in a way we can rely on, without pushing breaking changes to consumers of shared code, while still having a way to signal updates (ex. security and performance improvements) people can opt into.

This is a work in progress to demonstrate the concept.


## Detail

### draw

Takes single function, that returns source code for a given path or url, and returns a Promise(function)

### cache-barrel

A function that searches an in-memory cache for a function, otherwise it checks the disk _(eg `./shelf`)_ to find the code, and otherwise fetches the data from the web. The disk and memory caches are subsequently updated to cache values as they are retrieved from lower levels.

Each function saved on disk is saved in it's own file, similar to the remote dependency drawn from the web. If multiple remote functions were saved in the same file(s) instead, they would cause many changes in those files over the life of a project (git history), and make remote dependency resolution for those functions substantially more difficult to track and manage effectively.