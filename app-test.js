(async () => {

    let ff = require('./ffetch')('./shelf')
    let test_framework = require('./test')

    //todo move full_path into ffetch?
    let full_path = (file) =>
        file.includes(__dirname) ? file
            : require('path').join(__dirname, file)

    let ffp = (path) => ff(full_path(path))

    let multiply = ffp('./functions/multiply.js')

    let result = await multiply(3, 4)

    console.log('5 * 34 = ' + result)

    let test_test = await ffp('./tests/test-test.js')(test_framework)

    console.log('test_test result: ' + test_framework.display_message(test_test))
})()