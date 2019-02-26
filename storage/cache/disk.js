module.exports = function (cache_dir, fetch_code) {

    const fs = require('fs')
    const path = require('path')

    const print = require('../../dev-utils/dev-printer')(printerOn = false)

    if (!fs.existsSync(cache_dir)) {
        let full_dir = path.resolve(cache_dir)
        let err_text = `disk cache initialization error --> require('ffetch')(${cache_dir})\n\n`
        err_text += ` * If you inteded to require('ffetch') with default settings\n`
        err_text += `   you should add trailing empty params after import\n   --> const ffetch = require('ffetch')()`
        let expected_dir = `!! Directory [${full_dir}] does not exist.
        Either create [${full_dir}]\n\t\tor provide an existing directory.`
        console.log('__'.repeat(55))
        console.log(`${err_text}\n\n${expected_dir}`)
        console.log('^^'.repeat(55))
        throw expected_dir
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
            print(`local function, loading from disk`)
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

                let namepart = path.basename(filename)
                print('namepart:' + namepart)
                if (!namepart.startsWith('https_--'))
                    throw `Could not find file: ${filename}`

                return fetch_code(dependency).then((val) => disk_add(filename, val))
            }

        })
        //.catch(err => 'disk cache error -> ' + err) // Todo don't return text message as code, return result type?
    }

    return lookup
}
