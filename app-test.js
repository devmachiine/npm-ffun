(async () => {

    // Setup
    let print = console.log
    print('_'.repeat(65))
    let start_time = new Date().getTime();

    let ff = require('./ffetch')('c:/shelf')
    let test_framework = { test, assert, display_message, tally_results, assert_test } = require('./dev-utils/test-framework')

    /* Test basics */

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

    let { overview: basic_result, error_messages: basic_errors } = tally_results(test_local, test_url, test_injection, test_scope)
    print(`Outer - ${basic_result}\n${basic_errors}`)

    /* Test behaviour from within a ffetched function */

    let test_local_local = await ff('./tests/self-contained/local/local-load-local.js')(test, assert)
    let { overview: extended_result, error_messages: extended_errors } = tally_results(test_local_local)
    print(`Inner - ${extended_result}\n${extended_errors}`)

    // pending tests:
    // [x] local load local
    // [ ] local load remote
    // [ ] local load relative
    // [ ] remote load remote
    // [ ] remote load relative
    // [ ] maybe - local and remote, nesting all tests above
    // [ ] maybe - dependency upgrade, or signal ~ if it's to be part of this POC.

    let end = new Date().getTime();
    let time = end - start_time;
    print(`Completed in ~ ${time} ms`)
    print('_'.repeat(65))
})()