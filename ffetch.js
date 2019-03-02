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
        throw new Error('require(ff)(directory-string || dependency-resolver-function')
    }

    let web_resolve = (dependency, parent_path) => {
        print('web_resolve dependency : ' + dependency)

        if (dependency.startsWith('./')) {

            // todo doc root-relativity (this code in enlish)

            print('🍌 dependency: ' + dependency)
            // --> ./demo-functions/math/multiply.js
            print('🦍 parent_path:' + parent_path)
            // --> https://raw.githubusercontent.com/devmachiine/ffetch-test/master/demo-functions/math/multiply.js

            let dep_sub_path = dependency.replace('.', '')
            // --> /demo-functions/math/multiply.js
            let dep_trim_filename = dep_sub_path.substring(0, dep_sub_path.lastIndexOf('/'))
            // --> /demo-functions/math
            let par_trim_filename = parent_path.substring(0, parent_path.lastIndexOf('/'))
            // --> https://raw.githubusercontent.com/devmachiine/ffetch-test/master/demo-functions/math
            let par_root = par_trim_filename.substring(0, par_trim_filename.lastIndexOf(dep_trim_filename))
            // -->  https://raw.githubusercontent.com/devmachiine/ffetch-test/master
            let relative_web_dependency = par_root + dep_sub_path
            // --> https://raw.githubusercontent.com/devmachiine/ffetch-test/master/demo-functions/math/multiply.js
            print ('tttttaaarget ->>' + relative_web_dependency)
            return relative_web_dependency
        }

        return dependency
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

        let fun = (new Function(`return ((ff) => (async ${code}\n))`))()(ff$(resource));

        return fun
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

            } catch (oops) {
                print(`🎣 ffetch oops: [${oops}]\n${JSON.stringify(oops)}`)
                // todo return result type? { code: .. (or undefined), author, timestamp, hash }
                print('🤮 rethrow ffetch oops')
                throw new Error(`ffetch error ${resource_path} with args (${funcArgs}) --> ${oops}`)
            }
        })()

    return fetch_and_build
}
