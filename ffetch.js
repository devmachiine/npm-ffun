module.exports = function (fetch_code, root_dir) {
    
    // const debug_mode = true
    const print = typeof debug_mode === 'undefined' ? () => 0 : console.debug

    const path = require('path')

    // alternatives - https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    root_dir = root_dir || path.dirname(require.main.filename)

    if (typeof fetch_code === 'undefined') {
        let default_cache_dir = path.join(root_dir, './shelf')
        let fs = require('fs')
        if (!fs.existsSync(default_cache_dir)) {
            console.log('>> default cache dir created in app root: ' + default_cache_dir)
            fs.mkdirSync(default_cache_dir)
        }
        fetch_code = default_cache_dir
    }

    if (typeof fetch_code === "string") {
        fetch_code = require('./storage/cache-stack')(fetch_code)
    }
    else if (typeof fetch_code !== "function") {
        throw ('require(ff)(directory-string || dependency-resolver-function')
    }

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

    let web_resolve = (dependency) => {
        // TODO to find relative path code as it was, instad of currently always dynamic resolver.
        // write 'treewalkers'
        // eg for github, it has https..github..commit..code
        //     relative-> with ..path..[code as it was found at same root commit time]
        // eg for own api's, a standard like
        //                https..url../[timestamp]/..paths../...code
        //     relative -> with (same-url-root)[same timestamp]../..paths../..code
        print('web_resolve dependency : ' + dependency)
        return dep
    }

    // todo - is this disk abstraction bleed that could be handled in disk.js ?
    let local_resolve = (dependency) => {
        let full_path = (file) =>
            file.includes(root_dir) ? file
                : path.join(root_dir, file)

        let target = full_path(dependency)

        print('relative dependency changed to: ' + target)

        return target
    }

    // Traverse/Root relative reference should be the same for web and local references.

    // todo resolver for extenal relative named functions
    // ex: function on example.com/funcAbc calls function (./function2)
    //     then (/.function2) is resolved to example.com/demo2/etc5xyz.js
    let resolve_name = (dependency) => {
        let dep = dependency
        print('------> resolve -> dep: ' + dep)

        // only resolve relative names given by ./ or ../../ etc..
        if (!dep.startsWith('.')) {
            print('!startswith .')
            return dep
        }

        if (dep.startsWith(`https://`)) {
            return web_resolve(dep)
        }

        if (typeof ffetch_path !== "undefined") {
            print('resolve_name.ffetch_path = ' + ffetch_path)

            //todo NB if ffetch_path = web, use web resolver.

            // assumption, only local disk resolve 
            return local_resolve(dependency)
        }
        else {
            print('resolve_name set root?')
            // assumption, only local disk resolve 

            return local_resolve(dependency)
        }
    }

    let build = (code, context, ffetch_path) => {
        // let build = (code, context) => {
        // print('build - code: ' + code.length + ' loc')
        // print('build - context: ' + context)

        let fb = (() => {
            this.ffetch_path = ffetch_path
            return context
        })()

        // todo better error messages for incorrect code, eg:
        // empty or comment-only code gives -> async is not defined
        // code that doesn't start with expression gives -> SyntaxError: Unexpected token (

        let fun = (new Function(`return ((ff) => (async ${code}\n))`))()(fb);

        return fun
    }

    let fetch_and_build = (resourcePath) => (...funcArgs) =>
        (async () => {
            try {
                if (typeof ff !== "undefined")
                    print('fetch_and_build.ff = ' + ff)

                if (typeof ffetch_path !== "undefined") {
                    print('fetch_and_build.ffetch_path = ' + ffetch_path)
                } else {
                    print('in fetch_and_build, no ffetch_path, too late to set initial root?')
                }

                print('f&b')
                let resource = await resolve_name(resourcePath)
                print('f&b.resource = ' + resource)
                let code = '' + await fetch_code(resource)
                print('f&b.code = ' + code.length)
                let func = await build(code, fetch_and_build, resource)
                print('f&b.func = ' + func.toString().length)

                return func(...funcArgs)

            } catch (oops) {
                print(`ffetch oops: [${oops}]\n${JSON.stringify(oops)}`)
                // todo return result type? { code: .. (or undefined), author, timestamp, hash }
                throw `ffetch error ${resourcePath} with args (${funcArgs}) --> ${oops}`
            }
        })()

    print('ffetch returns a ' + fetch_and_build, false)

    return fetch_and_build
}
