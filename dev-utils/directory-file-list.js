module.exports = (directory) => {

    let fs = require('fs')
    let path = require('path')

    let root_dir = path.dirname(require.main.filename)

    let full_path = (file) =>
        file.includes(root_dir) ? file
            : require('path').join(root_dir, file)

    let file_names = (dir) =>
        fs.readdirSync(dir).reduce((names, file) => {
            let full_path = path.join(dir, file)
            let is_file = fs.statSync(full_path).isFile()
            return names.concat(is_file ? [full_path] : file_names(full_path))
        }, [])

    return file_names(full_path(directory))
}
