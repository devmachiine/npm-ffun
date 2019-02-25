(test, assert) => {
    let comments_ok = await ff('./tests/external-setup/ok-test-comment.js')()

    let comments_error = 'ok'
    try {
        comments_error = await ff('./tests/external-setup/error-test-comment.js')()
    } catch (err) {
        comments_error = err
    }

    let expected_build_error = `ffetch error ./tests/external-setup/error-test-comment.js with args () --> SyntaxError: Unexpected token (`
    
    return test('comments can be used inside and after test functions',
        () => {
            assert(comments_ok, 'ok')
            assert(comments_error, expected_build_error)
        })
}