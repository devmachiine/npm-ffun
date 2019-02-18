module.exports = function (fetch_code) {
    let print = require('./dev-printer')(printerOn = true)

    if (typeof fetch_code === "string") {
        fetch_code = require('./cache-barrel')(fetch_code)
    }
    else if (typeof fetch_code !== "function") {
        throw ('require(ff)(directory-string || dependency-resolver-function')
    }

    let build = (code, context, ffetch_path) => {
        // let build = (code, context) => {
        print('build - code: ' + code.length + ' loc')
        // print('build - context: ' + context)
        // let fun = (new Function(`return ((ff) => (async ${code}))`))()(context);

        let fb = (() => {
            this.ffetch_path = ffetch_path
            return context
        })()

        // let ffetch2 = path => (...params) => context(path, ...params)

        // let fun = (new Function(`return ((ff,f2) => (async ${code}))`))()(fb, ffetch2);
        let fun = (new Function(`return ((ff) => (async ${code}))`))()(fb);

        // print('funky funk built: ' + fun2)

        return fun
    }

    // let fetch_and_build = (resourcePath) => {
    //     return fetch_code(resourcePath)
    //         .then((code) => build(code, fetch_and_build))
    //         .catch((oops) => {
    //             print('ffetch oops:' + oops);
    //         })
    // }

    // todo: use ./ in http as domain root to resolve dependency path
    // example
    // https://raw.githubusercontent.com/username/project/branch/folder/folder2/some.js
    //
    // Traverse upwards relative
    // has reference to [/bla/other.js], and is found in:
    // https://raw.githubusercontent.com/username/project/branch/folder/bla/other.js
    //
    // Root relative
    // has reference to [./foo/bar.js], and is found in:
    // https://raw.githubusercontent.com/foo/bar.js
    //
    // const relative_fetch = require('/relative-fetch', fetch)

    // Traverse/Root relative reference should be the same for web and local references.

    // todo resolver for extenal relative named functions
    // ex: function on example.com/funcAbc calls function (./function2)
    //     then (/.function2) is resolved to example.com/demo2/etc5xyz.js
    let resolve_name = (dependency) => {
        let dep = dependency
        console.log('------> resolve -> dep: ' + dep)

        if (typeof ffetch_path !== "undefined") {
            console.log('resolve_name we know ffetch_path is: ' + ffetch_path)

            // assumption, only local disk resolve // todo! web resolve.

            const path = require('path')
            let root_dir = path.dirname(ffetch_path)

            console.log('root is : ' + root_dir)

            let target = path.join(root_dir, dependency)

            console.log('relative dependency changed to: ' + target)

            return target
        }
        else {
            console.log('resolve_name set root?')
            return dependency
        }
    }

    let fetch_and_build = (resourcePath) => (...funcArgs) =>
        (async () => {
            try {
                if (typeof ff !== "undefined")
                    console.log('in fetch_and_build we know ff is: ' + ff)

                if (typeof ffetch_path !== "undefined") {
                    console.log('in fetch_and_build we know ffetch_path is: ' + ffetch_path)
                } else {
                    console.log('in fetch_and_build, no ffetch_path, too late to set initial root?')
                }

                let resource = await resolve_name(resourcePath)
                let code = await fetch_code(resource)
                let func = await build(code, fetch_and_build, resource)
                // let func = await build(code, fetch_and_build)
                return func(...funcArgs)

                // print('fetch_and_build -- code--------------')
                // print('' + code)
                // print('func--------------')
                // print('' + func)

                // if (funcArgs && funcArgs.length) {
                //     print('fetch_and_build args -> ' + funcArgs)
                //     return await func(...funcArgs)
                // }
                // else return func
            } catch (oops) {
                print('ffetch oops:' + oops);
            }
        })()

    print('fetchandbuild--------')
    print(fetch_and_build)

    return fetch_and_build
}
