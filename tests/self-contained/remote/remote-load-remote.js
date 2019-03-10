(test, assert) => {

    let test_remote_call_remote = ff('https://raw.githubusercontent.com/devmachiine/ffetch-test/a33354e7dc6d16fe11fe3025227b3511027aa187/demo-functions/hop-test.js')

    let test_add = await test_remote_call_remote(test, assert)

    return test('remote load remote', () => {
        assert(true, !test_add.error)
        assert(test_add.description, 'remote functions can load other remote functions')
    })
}