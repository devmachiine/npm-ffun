(async () => {

    let ff = require('./ffetch')('./shelf')

    //todo move full_path into ffetch?
    let full_path = (file) =>
        file.includes(__dirname) ? file
            : require('path').join(__dirname, file)

    let multiply = ff(full_path('./functions/multiply.js'))

    let result = await multiply(3, 4)

    console.log('5 * 34 = ' + result)
})()