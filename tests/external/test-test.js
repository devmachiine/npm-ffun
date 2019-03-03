(framework) => {
    let { test, assert, assert_fun } = framework
    let ok_test = test(`show [ok] on ok`, () => {
        let two = 2
        assert(`${two} == 2`)
    })
    let err_eval = test(`show evaluation on error`, () => {
        assert(`1 > 2`)
    })
    let err_eval_err = test(`show evaluation exception`, () => {
        assert(undefined_variable)
    })
    let err_throw = test(`show thrown error`, () => {
        throw 'ThrownError'
    })
    let ok_test_tests = test(`test functions yield expected results`, () => {
        let test_test = (result, expected_assert) => {
            let passed = !result.error
            assert_fun(() => passed === expected_assert, 'unexpected result in test: ' + result.description)
        }
        test_test(ok_test, true)
        test_test(err_eval, false)
        test_test(err_eval_err, false)
        test_test(err_throw, false)
    })
    return ok_test_tests
}