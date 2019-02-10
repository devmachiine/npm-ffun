module.exports = function (cacheDir, fetch_value) {

    const fs = require('fs')
    let print = require('../dev-printer')()

    // Init file cache
    print('disk cache dir:' + cacheDir)

    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }

    let disk_fetch = (file) => new Promise((resolve, _reject) => {
        fs.readFile(file, (err, data) => resolve(err ? undefined : data))
    })

    let disk_add = (filePath, value) => new Promise((resolve, reject) => {
        fs.writeFile(filePath, value, function (err) {
            if (err) reject(err)
            else resolve(value)
        });
    })

    let toFileName = (data) => data.replace(/\//g, '-').replace(/\:/g, '_')

    let convertKeyToFilePath = (key) => `${cacheDir}/${toFileName(key)}.txt`
    // todo folder(s) for files // or .external for remote dependency

    let lookup = dependency => {

        let keyPath = convertKeyToFilePath(dependency)

        return disk_fetch(keyPath).then((diskVal) => {
            if (diskVal) {
                print('disk retrieved: ' + diskVal)
                return Promise.resolve(diskVal)
            } else {
                print(`disk seek`)
                return fetch_value(dependency).then((val) => disk_add(keyPath, val))
            }

        }).catch(err => print('disk cache error -> ' + err))
    }

    return lookup
}