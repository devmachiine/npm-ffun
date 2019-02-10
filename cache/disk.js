module.exports = function (cacheDir, fetch_value) {

    const fs = require('fs')
    let print = require('../dev-printer')()

    // Init file cache
    print('disik cache dir:' + cacheDir)
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

    let disk_add = (filePath, value) => new Promise((resolve, reject) => {
        fs.writeFile(filePath, value, function (err) {
            if (err) {
                reject(err)
            } else resolve(value) // or dont resolve to something specific
        });
    })

    // todo folder(s) for file 
    // let toBase64Key..
    let convertKeyToFilePath = (key) => cacheDir + '/test.internal' // or .external for remote dependency

    let lookup = dependency => {
        print(`didn't find it in memory, pulling it from the filesystem`)

        let keyPath = convertKeyToFilePath(dependency)

        return disk_fetch(keyPath).then((diskVal) => {

            print(` -- disk val -> ${diskVal}`)
            if (diskVal) {
                print('read value from disk: ' + diskVal)
                return Promise.resolve(diskVal)
            } else {
                print(`didn't find it on the filesystem, pulling it from the web`)
                return fetch_value(dependency).then((val) => disk_add(keyPath, val))
            }

        }).catch(err => print('oh file.. ' + err))
    }

    return lookup
}