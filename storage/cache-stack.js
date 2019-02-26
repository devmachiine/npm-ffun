module.exports = function (cache_dir) {

    // use 'the internet' cache
    const fetch_code = require('./cache/web')

    // behind the disk cache
    let disk_or_web = require('./cache/disk')(cache_dir, fetch_code)

    // behind the memory cache
    let lookup = require('./cache/memory')(disk_or_web)

    return lookup
}
