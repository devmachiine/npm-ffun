# npm-draw-poc

POC for function-level dependencies.

Usage:

Say that `https://example.com/some/url/lambda_function.js` has code:

```javascript
(x, y) => x + y
// a single arrow function
```

then, using folder `shelf` relative to execution of nodejs program:

```javascript
const cache = require('./cache-barrel')('./shelf') // in-memory & disk cache, that fetches from url if not found
const ff = require('./draw.js')(cache) // accepts a single function that retrieves code from url or disk

let path = 'https://example.com/some/url/lambda_function.js'

ff(path).then((f) => console.log('result = ' + f(3, 8)))

```

outputs: `result = 11`
