(async () => {

    // time app-teset
    console.log('- '.repeat(40))
    var start_time = new Date().getTime();

    // ffetch
    let ff = require('./ffetch')('./shelf')
    //todo move full_path into ffetch?
    let full_path = (file) =>
        file.includes(__dirname) ? file
            : require('path').join(__dirname, file)
    let ffp = (path) => ff(full_path(path))

    // test_framework
    let test_framework = require('./test')
    let { test, assert, display_message } = test_framework
    let display = (result) => console.log(display_message(result))
    let assert_test = (result) => {
        if (result.error) {
            throw '\n [x] ' + result.description + '\n      --> ' + result.error
        }
    }

    let multiply = ffp('./functions/multiply.js')
    let result = await multiply(3, 4)
    let basic_test = test("basic function ffetches and computes as expected", () => {assert(`${result} == 12`)})

    let test_test = await ffp('./tests/test-test.js')(test_framework)
    let test_injection = test("test framework can be injected into functions", () => {
        assert_test(test_test)
    })

    let tally_display = (...results) => {
        let total = 0, errors = 0
        results.forEach(result => {
            if (result.error) {
                display(result)
                errors++
            }
            total++
        })
        // todo error/errors test/tests grammar.
        console.log(`Ran ${total} tests${errors > 0 ? ` with ${errors} errors !!` : ' successfully.'}`)
    }

    tally_display(test_injection, basic_test)

    var end = new Date().getTime();
    var time = end - start_time;
    console.log(`Completed in ~ ${time} ms`)
    console.log('- '.repeat(40))
})()