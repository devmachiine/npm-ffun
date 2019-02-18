let full_path = (file) =>
    file.includes(__dirname) ? file
        : require('path').join(__dirname, file)

let cache_dir = full_path('./shelf')

var ff = require('./ffetch.js')(cache_dir)

let remote_add = 'https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/2f980ee176dfa76d03dda4bf1737c3fe6a727eae/add.js'

let local_multiply = full_path('./functions/multiply.js')

//throw 'run for the hills!'

let ff_demo = require('./ffetch_2019-02-15')(cache_dir)

let demo_f = path => {
    let startTime = Date.now()
    return ff_demo(path).then((f) => {
        console.log('f(5 ,10) = ' + f(5, 10))
        let endTime = Date.now()
        console.log(`demo took ${(endTime - startTime) / 1000} seconds.`)
    })
}

let program_end = false // prevent node.js exit while async code runs

let demo1 = demo_f(remote_add).
    then(() => demo_f(remote_add)).
    then(() => demo_f(local_multiply)).
    then(() => demo_f(local_multiply)).
    catch((oops) => console.log('oops ~ ' + oops)).
    then(() => console.log('--------------- end demo 1 ---------------'))

// DONE! Bake-in await/async so that ff functions can call ff,
// and that await is avaliable in ff functions, even if they don't use ff.

let local_depend_local = full_path('./functions/local-depend-local.js')

let demo_f2 = pathf2 => {
    let startTime = Date.now()
    let asyncFunc = ff(pathf2)(5)
    return asyncFunc.then(f5 => {
        console.log('f(5) = ' + f5)
        let endTime = Date.now()
        console.log(`demo 2 took ${(endTime - startTime) / 1000} seconds.`)
    })
}

demo1.then(() => {
    demo_f2(local_depend_local).
        // then(() => demo_f2(local_depend_local)).
        catch((oops) => console.log('oops2 ~ ' + oops)).
        then(() => { program_end = true })
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
    if (program_end) setTimeout(wait, 50);
})();