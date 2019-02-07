var cache = require('./cache-barrel')('some file')
var ff = require('./draw.js')(cache)

let addPath = 'https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/2f980ee176dfa76d03dda4bf1737c3fe6a727eae/add.js'

let startTime = Date.now()

let demo_f = f => {
    console.log("f is a -> " + f)
    console.log('f(3,8) = ' + f(3, 8));
}

let program_end = false // prevent node.js exit while async code runs

ff(addPath).then(f => demo_f(f)).then(() => ff(addPath)).then(f => demo_f(f))
.catch((oops) => console.log('oops ~ ' + oops))
.then(() => {
    let endTime = Date.now()
    console.log(`program took ${(endTime - startTime) / 1000} seconds.`)
    program_end = true
});

// name ideas..
// source branch > hunt, rope, lint, ffetch, use, aquire, get, ff, defn, foo, reqf, ask, arc, draw, canopy
// dependency upgrade > reap
// tree reduction  > bonsai
//
// possibly conflicting names not to use: f, fx, fn, fun, func ?
//
// ff : fetch function async
// fi : get function now, non async ~ ff calls fi

(function wait() {
    if (!program_end) setTimeout(wait, 50);
})();