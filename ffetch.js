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

            // todo regex to remove filenames in dep_path & par_path
            // todo doc root-relativity (this code in enlish)
            print('le dep: ' + dependency)
            print('le par:' + parent_path)

            let dep_path = path.dirname(dependency.replace("./", ""))
            print('🍌 dep_path: ' + dep_path)

            let par_path = path.dirname(parent_path.replace('https://', ''))
            print('🦍 par_path: ' + par_path)

            let cut_index = par_path.lastIndexOf(dep_path)

            let domain_and_subpath = par_path.substring(0, cut_index)

            let target = 'https://' + domain_and_subpath + dependency.replace('./', '')

            print('tttttaaarget! ' + target)

            return target
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
