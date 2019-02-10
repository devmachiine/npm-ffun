module.exports = function (cacheDir) {

    // use 'the internet' cache
    const fetch = require('./node-fetch')

    // behind the disk cache
    let disk_or_web = require('./cache/disk')(cacheDir, fetch)

    // behind the memory cache
    let lookup = require('./cache/memory')(disk_or_web)

    // todo resolver for extenal relative named functions
    // ex: function on example.com/funcAbc calls function (./function2)
    //     then (/.function2) is resolved to example.com/demo2/etc5xyz.js
    let resolve_name = (dependency) => {
        return Promise.resolve(dependency).then((key) => lookup(key))
    }

    return resolve_name
}
