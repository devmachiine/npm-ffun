(async () => {

    /*  Setup */

    let print = console.log
    print('_'.repeat(65))
    let start_time = new Date().getTime();

    let ff = require('./ffetch')()
    let test_framework = {
        test, test_async, assert, tally_results
    } = require('./dev-utils/test-framework')

    /* Test basics */

    let basic_tests = await Promise.all([

        test_async("local root function ffetches and works",
            ff('./hello-fetch.js')('forest'),
            (result_hello) => assert(result_hello, 'Hello, forest!'))

        , test_async("local simple arrow expected to fail (but works @ 2019.3.3)",
            ff('./tests/external/arrow-only.ts1128')(),
            (result_hello) => assert(result_hello, 'not recommended to ommit variable or ()'))

        , test_async("local nested function ffetches and works",
            ff('./tests/external/math/multiply.js')(3, 4),
            (twelve) => assert(twelve, 12))

        , test_async("url path ffetches remote function",
            ff('https://gist.githubusercontent.com/devmachiine/4433df78dc698aebad5aa37be15475fa/raw/59fdf8c2031d2418539adb98dfad73fcd1469acd/add.js')(34, 16),
            (fifty) => assert(fifty, 50))

        , test_async("test framework can be injected into functions",
            ff('./tests/external/test-test.js')(test_framework),
            (test_result) => {
                if (test_result.error) { throw test_result.error }
                assert(test_result.description, 'test functions yield expected results')
            })

        , test_async("function scope initialy set to ffetched code",
            ff('./tests/external/test-scope.js')(test_framework),
            (result) => assert(result.error, 'ReferenceError: print is not defined'))

        , test_async("non-url path expects to start with './'",
            test_async("ff without ./", ff('hello-fetch.js')('forest'), () => _na),
            (result) => assert(!!result.error, true))
    ])

    /* Test behaviour from within a ffetched function */

    let directory_files = require('./dev-utils/directory-file-list')

    let extra_tests = await Promise.all(
        directory_files('./tests/self-contained/')
            .filter(path => path.endsWith('.js'))
            .map(test_path => ff(test_path)(test, assert)))

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

Test  injection behavior
[ ] create test regarding injection without explicit binding on function input (see test-scope.js)
[ ] injection ~ ommit injected function is ok, but replacing it in unexpected order breaks.

[ ] Scope insecure test -> prove tat access to outer still possible regardless of injection
[ ] change all throw/catch to result type (if re-use simple)

fforest.
[ ] maybe - dependency upgrade, or signal ~ if it's to be part of this POC.

tests
[ ] root-relativity behavior

*/
