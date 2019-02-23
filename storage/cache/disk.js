module.exports = function (cache_dir, fetch_value) {

    const fs = require('fs')
    const path = require('path')

    const print = require('../../dev-utils/dev-printer')(printerOn = false)

    // Init file cache
    if (!fs.existsSync(cache_dir)) {
        // fs.mkdirSync(cache_dir);
        let full_dir = path.resolve(cache_dir)
        let error_reason = 'Rather a hard error than just creating a directory unexpectedly :'
        let expected_dir = `!! Directory [${cache_dir}] does not exist,
        --> please create [${full_dir}] or provide an existing directory : require('./ffetch')([over here]).`
        console.log('__'.repeat(55))
        console.log(`${error_reason}\n\n${expected_dir}`)
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
                print('namepart:' +namepart)
                if (!namepart.startsWith('https_--'))
                    throw `Could not find file: ${filename}`

                return fetch_value(dependency).then((val) => disk_add(filename, val))
            }

        })
        //.catch(err => 'disk cache error -> ' + err) // Todo don't return text message as code, return result type?
    }

    return lookup
}
