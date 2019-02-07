module.exports = function (cacheFile) {

    const fetch = require('./node-fetch')
    let print = require('./dev-printer')()

    print('barrel file:' + cacheFile)
    // devnote, if 1 file is insufficient, create subdirectories and files on base64names

    // check memory cache for function and return it, else
    // load file text
    // replace all ` with \`
    // cache += return new Function('i',code)
    // start async persistent_cache update(function text)
    // goto check :)

    //let memory cache..

    //let disk cache..

    //fetch from web.

    return function (dependency) {

        print('you used pokeball to catch [' + dependency + '] !!');
        
        return fetch(dependency)
            .then((code) => {
                print('got function: ' + code);
                return code;
            })
            .catch((oops) => {
                print('cache-barrel oops:' + oops);
            })
    };

}
