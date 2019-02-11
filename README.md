# npm-draw-poc

POC for function-level dependencies.

Usage:

Say that `https://example.com/some/url/lambda_function.js` has code:

```javascript
(x, y) => x + y
```

then, using folder `shelf` relative to execution of nodejs program:

```javascript
const cache = require('./cache-barrel')('./shelf')
const ff = require('./draw.js')(cache)

let path = 'https://example.com/some/url/lambda_function.js'

ff(path).then((f) => console.log('f(3,8) = ' + f(3, 8)))

```

outputs: `f(3,8) = 12`
