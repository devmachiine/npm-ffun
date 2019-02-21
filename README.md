# npm-ffetch-poc

Proof of concept for function-level dependencies.

In other words, instead of adding a whole package _(aka library)_ to your project as a dependency, you only add the functions _(aka methods)_ that you need. You can think of each function as a 'mini-package', and `ffetch.js` as an alternative supplement to npm.

## Example:

Say that you need a math function to add two numbers together, but you are not interested in the PI constant and the 100 other things a math package might provide.

You find the code you need in `https://example.com/url/math/addition-1992.js`

```javascript
// a single arrow function
(x, y) => x + y
```

Your nodejs app could import just the code it needs:

```javascript
// require ffetch and point it to a directory
// so that code is only ever downloaded once from the web
const ff = require('./ffetch.js')('./shelf') 

// url (or local file path) to our dependency
let path = 'https://example.com/url/math/addition-1992.js'

// fetch the function and run it locally
ff(path).then((add) => console.log(`2 plus 5 equals ${add(2, 5)}`))
```

Outputs: 
> `2 plus 5 equals 7`

## A more complex use case

The remote function could be more interesting. Fetched functions can also use `ffetch` themselves to retrieve other functions, and so forth, building an entire dependency tree they require to do complex tasks. An entire program can be built from only functions.

It takes a bit of practice in functional programming to think of constructing your programs in this way, but you will find it very rewarding to give it a try ~ regardless whether this project is a success or not.

## Background

Dependencies often entail breaking changes. Often, especially for small pieces of code, developers prefer to copy or re-invent the wheel to avoid this [dependency problem](https://www.youtube.com/watch?v=oyLBGkS5ICk) all togehter.

How many megabytes of dependencies does a project have ~ do you really need to download *all* the code, even if you only run a subset ?

Also, there is no benefit in re-testing and re-building the same things over and over if it's execution path hasn't changed. It slows down the dev/test feedback loop.

[Semantic versioning](https://semver.org/spec/v1.0.0-beta.html) makes dependency management a little easier with a convention:
<br/> \_.\_.x will probably not be a breaking change
<br/> \_.x.\_ also won't be a breaking change, pinky promise ;)
<br/> x.\_.\_ is more honenst : changes will possibly break your code, oops!

However the version number only reflects the interactions with a package/library. Sometimes. The behaviour changes from version to version, and a 0.0.x bump could still be a breaking change anyway.

What we want is to re-use shared code, without pushing breaking changes to unknown consumers, and signal updates that people can opt into. *(ex. security, bugfixes and performance improvements)*

## Futher work

Function-level dependency resolution, especially dynamically, provides it's own set of challenges and concerns to use over a traditional package manager (ex. npm, yarn).

I suspect dynamic resolution will have to be optional *(mainly for security & reliability reasons)*, and to rather/also create a build tool.

Just as any central repository (Github <3, brew.sh, etc..) can evaporate, that problem is exemplified by having thousands of url based dependencies. Instead of creating yet another package manager central, it would be better to have a p2p-mesh network for sharing code. Thoughts arount *that* project:
- Function identifiers could be a hash of the function, signed by the publisher on a shared ledger.
- A mechanism to enable the mesh to additionaly share optimized javascript, python, and eventually compiled language components.
- Who knows, maybe pure functions could be [memoized](https://en.wikipedia.org/wiki/Memoization) globally..

<!--
## Detail

### ffetch

Takes single function, that returns source code for a given path or url, and returns a Promise(function)

### ffetch(argument) ~ Directory name, or cache-barrel function

If the first argument isn't a directory name, it expects a dependency-resolver-function:

A function that searches an in-memory cache for a function, otherwise it checks the disk _(eg `./shelf`)_ to find the code, and otherwise fetches the data from the web. The disk and memory caches are subsequently updated to cache values as they are retrieved from lower levels.

Each function saved on disk is saved in it's own file, similar to the remote dependency drawn from the web. If multiple remote functions were saved in the same file(s) instead, they would cause many changes in those files over the life of a project (git history), and make remote dependency resolution for those functions substantially more difficult to track and manage effectively.
--> 
