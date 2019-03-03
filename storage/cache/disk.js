module.exports = function (cache_dir, fetch_code) {

    const fs = require('fs')
    const path = require('path')

    // const debug_mode = true
    const print = typeof debug_mode === 'undefined' ? () => 0 : console.log

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
        print("🤮 disk invalid cache_dir")
        throw new Error(expected_dir)
    }

    let disk_fetch = (file) => new Promise((resolve, _reject) => {
        fs.readFile(file, (err, data) => resolve(err ? undefined : data))
        // note ~ file is assumed to exist
        // only on exceptional 1st attempt error returns undefined etc..
        // todo restructure to clarify.
    })

    let disk_add = (file_path, value) => new Promise((resolve, reject) => {
        try {
            let file_dir = path.dirname(file_path)
            if (!fs.existsSync(file_dir)) {
                fs.mkdirSync(file_dir, { recursive: true })
            }
            fs.writeFileSync(file_path, value)
            resolve(value)
        }
        catch (err) {
            // ~ // todo ~ test io, and retry/bypass ~
            print('🎣 err --> ' + err)
            reject(`Error in ${path.basename(__filename)}: ${err}`)
        }
    })

    let valid_filename = (data) => data.replace('https://', '') + '.txt'

    let file_path = (key) => {
        if (key.startsWith(`https://`)) {
            print('remote function, loading from cache_dir')
            return path.join(cache_dir, valid_filename(key))
        }
        else {
            print(`local function, loading from disk without changing path`)
            return key
        }
    }

    let lookup = dependency => {

        let filename = file_path(dependency)
        print('disk lookup: ' + dependency)
        print('disk file request: ' + filename)
        print('disk file request: ' + path.resolve(filename))

        return disk_fetch(filename).then((disk_val) => {
            if (disk_val) {
                print(`disk retrieved: ${disk_val.toString().length} loc`)

                return Promise.resolve(disk_val)
            } else {
                print('disk cache miss')

                // file not found on disk, so we are resolving a cached dependency path, not local.
                if (!filename.startsWith(cache_dir)) {
                    if (!fs.existsSync(filename)) {
                        print(`🤮 file not found ${filename}`)
                        throw new Error(`file not found:[${filename}]`)
                    }

                    print('🤮 disk invalid filepath for cached dependency')
                    throw new Error(`Invalid cache directory for file: ${filename}.
                    Expected to start with [${cache_dir}]`)
                }

                return fetch_code(dependency).then((val) => disk_add(filename, val))
            }

        })
        //.catch(err => '🎣 disk cache error -> ' + err) // Todo don't return text message as code, return result type?
    }

    return lookup
}
