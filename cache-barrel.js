module.exports = function (cacheDir) {

    // use 'the internet' cache
    const fetch = require('./node-fetch')

    // behind the disk cache
    let disk_or_web = require('./cache/disk')(cacheDir, fetch)

    // behind the memory cache
    let lookup = require('./cache/memory')(disk_or_web)

    return lookup
}
