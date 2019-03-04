(async () => {

    /*  Setup */

    let print = console.log
    print('_'.repeat(65))
    let start_time = new Date().getTime();

    let ff = require('./ffun')()
    let test_framework = {
        test, test_async, assert, assert_fun, tally_results
    } = require('./dev-utils/test-framework')

    /* Test basics */

    let basic_tests = await Promise.all([

        test("local root function ffetches and works",
            ff('./hello-fetch.js')('forest'),
            (result_hello) => assert(result_hello, 'Hello, forest!'))

        , test("local simple arrow expected to fail (but works @ 2019.3.3)",
            ff('./tests/external/arrow-only.ts1128')(),
            (result_hello) => assert(result_hello, 'not recommended to ommit variable or ()'))

        , test("local nested function ffetches and works",
            ff('./tests/external/math/multiply.js')(3, 4),
            (twelve) => assert(twelve, 12))

        , test("url path ffetches remote function",
            ff('https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/59fdf8c2031d2418539adb98dfad73fcd1469acd/add.js')(34, 16),
            (fifty) => assert(fifty, 50))

        , test("test framework can be injected into functions",
            ff('./tests/external/test-test.js')(test_framework),
            (test_result) => {
                if (test_result.error) { throw test_result.error }
                assert(test_result.description, 'test functions yield expected results')
            })

        , test("function scope initialy set to ffetched code",
            ff('./tests/external/test-scope.js')(test_framework),
            (result) => assert_fun(() => result.error.startsWith('ReferenceError: print is not defined')))

        , test("non-url path expects to start with './'",
            test("ff without ./", ff('hello-fetch.js')('forest'), () => _na),
            (result) => assert(!!result.error, true))

        , test("syntax error in ffetch function can be caught",
            ff('./tests/external/error-syntax.js')().catch(err => { err.x = 'caught'; return err }),
            (err) => assert(err.x, 'caught'))

        , test("non existing function can be caught and ignored",
            ff('./tests/doesnt-exist.js')().catch(err => err))

        , test("file not found error returned",
            ff('./doesnt-exist.js')('forest').catch(err => '' + err),
            (result) => assert_fun(() => result.includes('file not found')))

    ])

    /* Test behaviour from within a ffetched function */

    let directory_files = require('./dev-utils/directory-file-list')

    let perform_test = (test_path) =>
        ff(test_path)(test, assert, assert_fun)
            .catch(err => { return { description: test_path, error: 'bzzk: ' + err } })

    let extra_tests = await Promise.all(
        directory_files('./tests/self-contained/')
            .filter(path => path.endsWith('.js'))
            .map(perform_test))

    /* Print tests results */

    print(tally_results('Basic', ...basic_tests))
    print(tally_results('Extra', ...extra_tests))

    let end_time = new Date().getTime()
    let elapsed = end_time - start_time
    print(`Completed in ~ ${elapsed} ms`)
    print('_'.repeat(65))

})().catch(err => {
    console.log('🎣 🦖 app-test err!\n')
    console.log(err.stack ? err.stack : '' + err)
})

/*  pending tests:
[x] local load local
[x] local load remote
[x] remote load remote
[x] remote load relative
[x] pass ff func to ff func
[ ] require available in ff (shouldn't it be? unless it's called _.njs?)
[ ] root-relativity behavior (attach upstream then resolve downstream ~> search url from left, then build from right)

Test  injection behavior
[ ] create test regarding injection without explicit binding on function input (see test-scope.js)
[ ] injection ~ ommit injected function is ok, but replacing it in unexpected order breaks.

[ ] Scope insecure test -> prove tat access to outer still possible regardless of injection

// Maybe not ~ ff turns into rejected state ~ conventional expectation of Promises (caller to catch) ?
[ ] change all throw/catch to result type (if re-use simple ~ eg add .default_value(x => undefined) prototype to ff.)

fforest.
[ ] maybe - dependency upgrade, or signal ~ if it's to be part of this POC.

*/
