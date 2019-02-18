(async () => {

    let ff = require('./ffetch')('./shelf')

    //todo move full_path into ffetch?
    let full_path = (file) =>
        file.includes(__dirname) ? file
            : require('path').join(__dirname, file)

    let multiply = (a, b) => ff(full_path('./functions/multiply.js')).then(m => m(a, b))

    // let f = params => ff(path).then(f => f(params))
    let m2 = (a, b) => ff(full_path('./functions/multiply.js'), a, b)
    
    let fp = path => (...params) => ff(full_path(path), ...params)

    let m3 = fp('./functions/multiply.js')

    // let m4 = 

    let result = await m3(5, 34)

    console.log('5 * 34 = ' + result)

})()