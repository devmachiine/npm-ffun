(test, assert) => {

    let test_remote_call_remote = ff('https://gist.githubusercontent.com/devmachiine/44c86b61bd8b98226d7ddbe97b4196ea/raw/66107ef784c8a72bb99fdac2acd23bdd4a8280f9/remote-remote.js')

    let test_add = await test_remote_call_remote(test, assert)

    return test('remote load remote',
        () => {
            assert(test_add.description, 'remote functions can load other remote functions')
            assert(!test_add.error)
        })
}