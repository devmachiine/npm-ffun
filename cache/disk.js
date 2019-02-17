module.exports = function (cache_dir, fetch_value) {

    const fs = require('fs')

    const print = require('../dev-printer')(printerOn = true)

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

    let file_path = (key) => {
        if (!key.startsWith(`https://`)) {
            console.log(`local function, loading from disk`)
            // devnote ~ check that path is in project root, and/or added to git.
            // -> for unknown consumers of this repo
            // -> for other forks/download of this repo to work correctly 
            return key
        }
        else return `${cache_dir}/${valid_filename(key)}.txt`
    }
    // todo folder(s) for files and .external for remote dependency

    let lookup = dependency => {

        let filename = file_path(dependency)
        print('disk lookup: ' + dependency)
        print('disk file request: ' + filename)

        return disk_fetch(filename).then((disk_val) => {
            if (disk_val) {
                // print('disk retrieved: ' + disk_val)

                return Promise.resolve(disk_val)
            } else {
                print('disk cache miss')

                if (!filename.startsWith('https://'))
                    throw `Could not find file: ${filename}`

                return fetch_value(dependency).then((val) => disk_add(filename, val))
            }

        }).catch(err => 'disk cache error -> ' + err) // Todo don't return text message as code result
    }

    return lookup
}
