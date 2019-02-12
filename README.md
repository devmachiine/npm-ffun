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

Module `draw` takes single function, that returns source code for a given path or url

Module `cache` searches an in-memory cache for a function, otherwise it checks the disk to find the code, and otherwise fetches the data from the web. The disk and memory caches are subsequently updated to cache values as they are retrieved from lower levels.