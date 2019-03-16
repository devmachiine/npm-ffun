(test, assert, affirm) => {
    let comments_ok = await ff('./tests/external/ok-test-comment.js')()

    let comments_error = 'ok'
    try {
        comments_error = await ff('./tests/external/error-test-comment.js')()
    } catch (err) {
        comments_error = err
    }

    let expected_build_errors = [
        `ffetch error ./tests/external/error-test-comment.js with args ()`
        , `ffetch.build :: function error`
        , `--> Unexpected token (`
    ]

    return test('comments can be used inside and after test functions',
        () => {
            assert(comments_ok, 'ok')

            expected_build_errors.forEach(build_error => {
                affirm(`expected |${build_error}| within |${comments_error}|`,
                    () => comments_error.message.includes(build_error)
                )
            })

        })
}