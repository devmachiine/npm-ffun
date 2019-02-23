(async () => {

    // Setup
    console.log('_'.repeat(65))
    var start_time = new Date().getTime();
    let print = require('./dev-utils/dev-printer')()

    // ffetch
    let ff = require('./ffetch')('c:/shelf')

    // test_framework
    let test_framework = require('./dev-utils/test-framework')
    let { test, assert, display_message } = test_framework
    let display = (result) => console.log(display_message(result))
    let assert_test = (result, error_message) => {
        if (result.error != error_message) {
            let err = !error_message ? result.error :
                `test did not fail as expected. ${result.error ?
                    `(${error_message} <--> ${result.error})` : 'No errors.'}`
            throw `\n [x] ${result.description}\n      --> ${err}`
        }
    }

    // Tests

    // local
    let multiply = ff('./tests/external-setup/multiply.js')
    let result_twelve = await multiply(3, 4)
    let test_local = test("local function ffetches and computes as expected",
        () => assert(`${result_twelve} == 12`))

    // url
    let add = ff('https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/59fdf8c2031d2418539adb98dfad73fcd1469acd/add.js')
    let result_fifty = await add(34, 16)
    let test_url = test("remote function ffetches and computes as expected",
        () => assert(`${result_fifty} == 50`))

    // injection
    let test_test = await ff('./tests/external-setup/test-test.js')(test_framework)
    let test_injection = test("test framework can be injected into functions",
        () => assert_test(test_test))

    // scope (access to outer still possible)
    let _outer_val = 1 || /* prevent linter suggestion */ _outer_val
    let outer_accesed = await ff('./tests/external-setup/test-scope.js')(test_framework)
    let test_scope = test("function scope initialy set to ffetched code",
        () => assert_test(outer_accesed, 'ReferenceError: _outer_val is not defined'))

    let tally_display = (...results) => {
        let total = 0, errors = 0
        results.forEach(result => {
            if (result.error) {
                display(result)
                errors++
            }
            total++
        })
        let ss = n => n > 1 ? 's' : ''
        print(`Ran ${total} test${ss(total)}${errors > 0 ? ` with ${errors} error${ss(errors)} !!` : ' successfully.'}`)
    }

    tally_display(test_local, test_url, test_injection, test_scope)

    // pending tests:
    // local load local
    // local load remote
    // local load relative
    // remote load remote
    // remote load relative
    // maybe - local and remote, nesting all tests above
    // maybe - dependency upgrade, or signal ~ if it's to be part of this POC.

    var end = new Date().getTime();
    var time = end - start_time;
    print(`Completed in ~ ${time} ms`)
    print('_'.repeat(65))
})()