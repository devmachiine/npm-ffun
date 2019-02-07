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

    //fetch from web.

    let web_fetch = function (dependency) {

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

    //let disk cache..

    //let memory cache..
    let memCache = new Map()

    let mem_fetch = (key) => memCache.get(key)
    let mem_add = (key, value) => memCache.set(key, value)

    // let toBase64Key..

    return (dependency) => {

        let memVal = mem_fetch(dependency);

        if (!memVal) {
            print(`didn't find it in the cache, pulling it from the web`)
            let web_val = web_fetch(dependency)
            mem_add(dependency, web_val)
            memVal = web_val
        } else print(`loaded cached value !`)

        return memVal
    }
}
