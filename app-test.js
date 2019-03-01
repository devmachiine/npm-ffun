(async () => {

    // Setup
    let print = console.log
    print('_'.repeat(65))
    let start_time = new Date().getTime();

    let ff = require('./ffetch')()
    let test_framework = {
        test, test_async, assert, display_message, tally_results, assert_test
    } = require('./dev-utils/test-framework')

    /* Test basics */

    let basic_tests = [

        test_async("local root function ffetches and works",
            ff('./hello-fetch.js')('forest'),
            (result_hello) => assert(result_hello, 'Hello, forest!'))

        , test_async("local simple arrow expected to fail (but works @ 2019.3.2)",
            ff('./tests/external-setup/arrow-only.ts1128')(),
            (result_hello) => assert(result_hello, 'not recommended to ommit variable or ()'))

        , test_async("local nested function ffetches and works",
            ff('./tests/external-setup/multiply.js')(3, 4),
            (twelve) => assert(twelve, 12))

        , test_async("url path ffetches remote function",
            ff('https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/59fdf8c2031d2418539adb98dfad73fcd1469acd/add.js')(34, 16),
            (fifty) => assert(fifty, 50))

        , test_async("test framework can be injected into functions",
            ff('./tests/external-setup/test-test.js')(test_framework),
            (test_test) => assert_test(test_test))

        , test_async("function scope initialy set to ffetched code",
            ff('./tests/external-setup/test-scope.js')(test_framework),
            (result) => assert(result.error, 'ReferenceError: print is not defined'))

        , test_async("non-url path expects to start with './'",
            test_async("ff without ./", ff('hello-fetch.js')('forest'), () => _na),
            (result) => assert(!!result.error, true))
    ]

    let completed_basic = await Promise.all(basic_tests)

    let basic_results = tally_results(...completed_basic)

    let { overview: basic_o, error_messages: basic_e } = basic_results
    print(`Basic ${basic_o}\n${basic_e}`)

    /* Test behaviour from within a ffetched function */

    let directory_files = require('./dev-utils/directory-file-list')

    let extra_tests = await Promise.all(
        directory_files('./tests/self-contained/')
            .map(test_path => ff(test_path)(test, assert)))

    let extra_results = tally_results(...extra_tests)
    let { overview: extra_o, error_messages: extra_e } = extra_results
    print(`Extra ${extra_o}\n${extra_e}`)

    // pending tests:
    // [x] local load local
    // [x] local load remote
    // [x] remote load remote
    // [ ] remote load relative
    // [ ] pass ff func to ff func
    // [ ] require available in ff (shouldn't it be? unless it's called _.njs?)

    // todo:
    // [x] test arrow-only.js
    // [ ] create test regarding injection without explicit binding on function input (see test-scope.js)
    // [ ] move test-test to it's own test (out of injection test), and update to use result_text(test)
    // [ ] Scope test: (access to outer still possible regardless of injection)
    // [x] change all throw to throw new Error to get stacktrace
    // [ ] change all throw/catch to result type (if re-use simple)
    // [ ] test coverage
    // [ ] maybe - dependency upgrade, or signal ~ if it's to be part of this POC.
    // [ ] maybe *explicitly not* local load relative
    // [ ] far maybe *not* ff_local to access local function (DI)

    let end = new Date().getTime();
    let time = end - start_time;
    print(`Completed in ~ ${time} ms`)
    print('_'.repeat(65))
})().catch(err => {
    console.log('🎣 app-test err!\n')
    console.log(err.stack ? err.stack : '' + err)
})