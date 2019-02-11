module.exports = function (cache_dir, fetch_value) {

    const fs = require('fs')

    // Init file cache

    if (!fs.existsSync(cache_dir)) {
        fs.mkdirSync(cache_dir);
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

    let valid_filename = (data) => data.replace(/\//g, '-').replace(/\:/g, '_')

    let file_path = (key) => `${cache_dir}/${valid_filename(key)}.txt`
    // todo folder(s) for files and .external for remote dependency

    let lookup = dependency => {

        let filename = file_path(dependency)

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
