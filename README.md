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

Semantic versioning states that:
_._.x will probably not be a breaking change
_.x._ also won't be a breaking change, pinky promise ;)
x._._ show honensty in that changes will possibly break your code, 'sorry'.

## Detail

### draw

Takes single function, that returns source code for a given path or url, and returns a Promise(function)

### cache-barrel

A function that searches an in-memory cache for a function, otherwise it checks the disk _(eg `./shelf`)_ to find the code, and otherwise fetches the data from the web. The disk and memory caches are subsequently updated to cache values as they are retrieved from lower levels.

Each function saved on disk is saved in it's own file, similar to the remote dependency drawn from the web. If multiple remote functions were saved in the same file(s) instead, they would cause many changes in those files over the life of a project (git history), and make remote dependency resolution for those functions substantially more difficult to track and manage effectively.