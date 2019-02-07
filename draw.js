module.exports = function (cacheDir) {

    const fetch = require('./node-fetch')
    let print = require('./dev-printer')
    print('cacheDir:' + cacheDir);

    let build = (code) => {
        let fun = (new Function(`return (${code})`))();
        fun.ff = (treetop) => print('ff passing not ready for sir/lady ~' + treetop);
        return fun;
    }

    // check memory cache for function and return it, else
    // load file text
    // replace all ` with \`
    // cache += return new Function('i',code)
    // start async persistent_cache update(function text)
    // goto check :)

    return function (dependency) {
        if (dependency === 'flush') {
            print('swish! n depenencies saved to disk!');
            return Promise.resolve(() => { });
        } else {
            print('you used pokeball to catch [' + dependency + '] !!');
            return fetch(dependency)
                .then((code) => {
                    print('got text: ' + code);
                    return build(code);
                })
                .catch((oops) => {
                    print('oops:' + oops);
                })
        }
    };
}
