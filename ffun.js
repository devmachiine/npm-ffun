module.exports = function (fetch_code, root_dir) {

    // const debug_mode = true
    const print = typeof debug_mode === 'undefined' ? () => 0 : console.log

    const path = require('path')

    // alternatives - https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
    root_dir = root_dir || path.dirname(require.main.filename)

    if (typeof fetch_code === 'undefined') {
        let default_cache_dir = path.join(root_dir, './nano_modules')
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
        print('🤮 ffetch init')
        throw new Error('require(ff)(directory-string || dependency-fetch-function')
    }

    let web_resolve = (dependency, parent_path) => {
        print('web_resolve dependency : ' + dependency)

        if (dependency.startsWith('./')) {

            print('🍌 dependency: ' + dependency)
            print('🦍 parent_path:' + parent_path)

            // dependency          -->                    ./c/d/multiply.js
            // parent_path         --> https://demo.com/a/b/c/d/square.js
            // dep_sub_path        -->                     /c/d/multiply.js
            // dep_trim_filename   -->                     /c/d
            // par_trim_filename   --> https://demo.com/a/b/c/d
            // par_root            --> https://demo.com/a/b
            // relative_dependency --> https://demo.com/a/b/c/d/square.js

            let dep_sub_path = dependency.replace('.', '')

            let dep_trim_filename = dep_sub_path.substring(0, dep_sub_path.lastIndexOf('/'))
            let par_trim_filename = parent_path.substring(0, parent_path.lastIndexOf('/'))
            let par_root = par_trim_filename.substring(0, par_trim_filename.lastIndexOf(dep_trim_filename))

            let relative_dependency = par_root + dep_sub_path

            print('tttttaaarget ->>' + relative_dependency)
            return relative_dependency
        } else {
            return dependency
        }
    }

    let local_resolve = (dependency) => {

        if (dependency.startsWith(root_dir)) {
            return dependency
        }

        // Todo demonstrate in tests:
        // Only resolve names from full_path. ~or~ root app source ./
        // With reason:
        // Relative outside of root and sharing files across projects shortens feedback loop.
        if (dependency.startsWith('./')) {
            return path.join(root_dir, dependency)
        } else {
            print("🤮 ffetch invalid dep")
            throw new Error(`missing './' --> required ffetch('./[path]'), but received ffetch(['${dependency}'])`)
        }
    }

    let resolve_path = (dependency, parent_path) => {
        print('⚡ ffetch.resolve_name = ' + dependency)

        if (dependency.startsWith(`https://`) || (parent_path && parent_path.startsWith(`https://`))) {
            return web_resolve(dependency, parent_path)
        }
        else return local_resolve(dependency)
    }

    let build = (code, context, resource) => {

        let ff$ = parent_path => resource_path => context(resource_path, parent_path)

        // todo better error messages for incorrect code, eg:
        // empty or comment-only code gives -> async is not defined
        // code that doesn't start with expression gives -> SyntaxError: Unexpected token (

        try {
            let fun = (new Function(`return ((ff) => (async ${code}\n))`))()(ff$(resource));
            return fun
        } catch (err) {
            err.message = `ffetch.build :: function error [${resource}] --> ${err.message}`
            print('🤮 rethrow build oops')
            throw err
        }
    }

    let fetch_and_build = (resource_path, parent_path) => (...funcArgs) =>
        (async () => {
            try {

                if (parent_path) {
                    print('~-'.repeat(50))
                    print('fetch_and_build.parent_path = ' + parent_path)
                }

                // print('f&b')
                let resource = await resolve_path(resource_path, parent_path)
                print('f&b.resource = ' + resource)
                let code = '' + await fetch_code(resource)
                // print('f&b.code = ' + code.length)
                let func = await build(code, fetch_and_build, resource)
                print('f&b.func = ' + func.toString().length)

                return func(...funcArgs)

            } catch (err) {
                print(`🎣 ffetch error: [${err}]\n${JSON.stringify(err)}`)
                // todo return result type? { code: .. (or undefined), author, timestamp, hash }
                print('🤮 rethrow ffetch error')
                err.message = `ffetch error ${resource_path} with args (${funcArgs}) --> ${err.message}`
                throw err
            }
        })()

    return fetch_and_build
}
