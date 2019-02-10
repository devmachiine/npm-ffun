module.exports = function (cacheDir, fetch_value) {

    const fs = require('fs')

    // Init file cache

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

    let convertToFilename = (key) => `${cacheDir}/${toFileName(key)}.txt`
    // todo folder(s) for files and .external for remote dependency

    let lookup = dependency => {

        let filename = convertToFilename(dependency)

        return disk_fetch(filename).then((disk_val) => {
            if (disk_val) {
                return Promise.resolve(disk_val)
            } else {
                return fetch_value(dependency).then((val) => disk_add(filename, val))
            }

        }).catch(err => 'disk cache error -> ' + err)
    }

    return lookup
}