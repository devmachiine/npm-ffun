module.exports = (directory) => {

    let fs = require('fs')
    let path = require('path')

    let file_names = (dir) =>
        fs.readdirSync(dir)
            .map(f => path.join(dir, f))
            .reduce((acc_files, current_path) => {
                let is_file = fs.statSync(current_path).isFile()
                return acc_files.concat(is_file ? [current_path] : file_names(current_path))
            }, [])

    let root_dir = path.dirname(require.main.filename)
    let relative_dir = path.join(root_dir, directory)

    return file_names(relative_dir)
}
