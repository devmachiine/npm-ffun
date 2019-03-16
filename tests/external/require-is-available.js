() => {

    for (p in this) {
        console.log(p, typeof p, this[p])
    }

    // return 'peanuts'U

    const fs = require('fs')

    const sub_paths = (dir_or_file) => fs.statSync(dir_or_file).isFile() ? []
        : fs.readdirSync(dir_or_file).map(sub_path => path.join(dir_or_file, sub_path))

    return sub_paths
}