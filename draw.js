module.exports = function (fetch_code) {
    let print = require('./dev-printer')()

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
