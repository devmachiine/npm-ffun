# npm-ffetch-poc

Proof of concept for function-level dependencies.

In other words, instead of adding a whole package _(aka library)_ to your project as a dependency, you only add the functions _(aka methods)_ that you need. You can think of each function as a 'mini-package'.

## Example:

Say that you need a math function to add two numbers together, but you are not interested in the PI constant and the 100 other things a math package might provide.

You find the code you need in `https://example.com/url/math/addition-1992.js`

```javascript
// a single arrow function
(x, y) => x + y
```

Your nodejs app could import just the code it needs:

```javascript
// require ffetch and download to code to ./shelf directory
const ff = require('./ffetch.js')('./shelf') 

// url (or local file path) to our dependency
let path = `https://example.com/url/math/addition-1992.js`

// fetch the function and run it locally
ff(path).then((f) => console.log('10 + 5 = ' + f(10, 5)))
```

outputs: 
> `result = 15`

## A more complex use case

The remote function could be a more interesting function. Ffetch'ed functions can also use ffetch themselves to retrieve other functions, and so forth, building an entire dependency tree they require to do any complex task, an entire program can be built from only functions.

This takes a bit of practice in functional programming to think of constructing your programs in this way, but you will find it very rewarding to learn, regardless whether this project is a success or not.

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

## Futher work

Function-level dependency resolution, especially dynamically, provides it's own set of challenges and concerns to use over a traditional package manager like we are used to.

I suspect the dynamic resolution will have to be optional, to rather have a build tool so the developer can choose when to upgrade packages convently.

<!--
## Detail

### ffetch

Takes single function, that returns source code for a given path or url, and returns a Promise(function)

### ffetch(argument) ~ Directory name, or cache-barrel function

If the first argument isn't a directory name, it expects a dependency-resolver-function:

A function that searches an in-memory cache for a function, otherwise it checks the disk _(eg `./shelf`)_ to find the code, and otherwise fetches the data from the web. The disk and memory caches are subsequently updated to cache values as they are retrieved from lower levels.

Each function saved on disk is saved in it's own file, similar to the remote dependency drawn from the web. If multiple remote functions were saved in the same file(s) instead, they would cause many changes in those files over the life of a project (git history), and make remote dependency resolution for those functions substantially more difficult to track and manage effectively.
--> 