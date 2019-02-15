module.exports = function (fetch_code) {
    let print = require('./dev-printer')(printerOn = true)

    if (typeof fetch_code === "string") {
        fetch_code = require('./cache-barrel')(fetch_code)
    }
    else if (typeof fetch_code !== "function") {
        throw ('require(ff)(directory-string || dependency-resolver-function')
    }

    let build = (code, context) => {
        print('build - code: ' + code)
        print('build - context: ' + context)
        let fun = (new Function(`return ((ff) => (async ${code}))`))()(context);
        return fun;
    }

    // let fetch_and_build = (resourcePath) => {
    //     return fetch_code(resourcePath)
    //         .then((code) => build(code, fetch_and_build))
    //         .catch((oops) => {
    //             print('ffetch oops:' + oops);
    //         });

    // }

    let fetch_and_build = async (resourcePath, ...optionalArguments) => {
        try {
            let code = await fetch_code(resourcePath)
            let func = await build(code, fetch_and_build)
            print('code--------------')
            print('' + code)
            print('func--------------')
            print('' + func)
            if (optionalArguments && optionalArguments.length) {
                print('there are args -> ' + optionalArguments)
                return await func(...optionalArguments)
            }
            else return await func
        } catch (oops) {
            print('ffetch oops:' + oops);
        }
    }

    print('fetchandbuild--------')
    print(fetch_and_build)

    return fetch_and_build
}
