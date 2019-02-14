module.exports = function (fetch_code = undefined) {
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
        let fun = (new Function(`return ((ff) => (${code}))`))()(context);
        //fun.ff = (treetop) => print('ff passing not ready for sir/lady ~' + treetop);
        return fun;
    }

    let fetch_and_build = (resourcePath) => {
        return fetch_code(resourcePath)
            .then((code) => build(code, fetch_and_build))
            .catch((oops) => {
                print('draw oops:' + oops);
            });

    }

    return fetch_and_build
}
