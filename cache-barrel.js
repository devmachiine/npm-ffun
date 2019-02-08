module.exports = function (cacheDir) {

    const fs = require('fs')
    const fetch = require('./node-fetch')
    let print = require('./dev-printer')()

    // devnote, if 1 file is insufficient, create subdirectories and files on base64names

    // check memory cache for function and return it, else
    // load file text
    // replace all ` with \`
    // cache += return new Function('i',code)
    // start async persistent_cache update(function text)
    // goto check :)

    //fetch from web.

    let web_fetch = function (dependency) {

        print('you used pokeball to catch [' + dependency + '] !!');

        return fetch(dependency)
            .then((code) => {
                print('got function: ' + code);
                return code;
            })
            .catch((oops) => {
                print('cache-barrel oops:' + oops);
            })
    };

    //let disk cache..

    // Init file cache
    print('barrel dir:' + cacheDir)
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir);
    }

    let fileExists = (file) => new Promise((resolve, reject) => {
        print('go stat : ' + file)
        fs.stat(file, function (err, _stat) {
            if (err == null) {
                print(`file ${file} exists, reading`)
                resolve(true);
            } else if (err.code === 'ENOENT') {
                print(`file ${file} doesn't exist`)
                resolve(false);
            } else {
                console.log('Some other error: ', err.code);
                reject('file exist error: ' + err.code);
            }
        })
    })

    let convertKeyToFilePath = (key) => cacheDir + '/test.internal' // or .external for remote dependency
    let disk_fetch = (file) => new Promise((resolve, reject) => {
        
        print(`disk read file = ${file}`)
        fileExists(file).then((exists) => {
            if (exists) {
                fs.readFile(file, (err, data) => {
                    if (err) reject(err)
                    else resolve(data)
                })
            } else resolve(undefined)
        })
    })
    let disk_add = (key, value) => new Promise((resolve, reject) => {
        let keyPath = convertKeyToFilePath(key)
        fs.writeFile(keyPath, value, function (err) {
            if (err) {
                reject(err)
            } else resolve(value) // or dont resolve to something specific
        });
    })

    //let memory cache..
    let memCache = new Map()

    let mem_fetch = (key) => memCache.get(key)
    let mem_add = (key, value) => memCache.set(key, value)

    // let toBase64Key..

    let lookup = (dependency) => {

        let keyPath = convertKeyToFilePath(dependency)

        let memVal = mem_fetch(keyPath);

        if (!memVal) {
            print(`didn't find it in memory, pulling it from the filesystem`)

            return disk_fetch(keyPath).then((diskVal) => {

                print(` -- disk val -> ${diskVal}`)
                if (diskVal) {
                    print('read value from disk: ' + diskVal)
                    // load to memory
                    mem_add(keyPath, diskVal)
                    memVal = diskVal
                    return Promise.resolve(memVal)
                } else {
                    print(`didn't find it on the filesystem, pulling it from the web`)
                    return web_fetch(dependency).then((web_val) => {
                        mem_add(keyPath, web_val)
                        return web_val
                    }).then((val) => disk_add(keyPath, val))
                }

            }).catch(err => print('oh file.. ' + err))
        } else return Promise.resolve(memVal)
    }

    return lookup
}
