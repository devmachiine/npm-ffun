var cache = require('./cache-barrel')('./shelf')
var ff = require('./draw.js')(cache)

let addPath = 'https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/2f980ee176dfa76d03dda4bf1737c3fe6a727eae/add.js'

let demo_f = path => {
    let startTime = Date.now()
    return ff(path).then((f) => {
        console.log("f is a -> " + f)
        console.log('f(3,8) = ' + f(3, 8));
        let endTime = Date.now()
        console.log(`demo took ${(endTime - startTime) / 1000} seconds.`)
    })
}

let program_end = false // prevent node.js exit while async code runs

demo_f(addPath).then(() => demo_f(addPath))
    .catch((oops) => console.log('oops ~ ' + oops))
    .then(() => {
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