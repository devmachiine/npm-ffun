(test, assert) => {

    let test_remote_call_remote = ff('https://gist.githubusercontent.com/devmachiine/44c86b61bd8b98226d7ddbe97b4196ea/raw/1528e221d7b4eef684eb8424286cc2506d869081/remote-remote.js')

    let test_add = await test_remote_call_remote(test, assert)

    return test('remote load remote',
        () => {
            assert(test_add.description, 'remote functions can load other remote functions')
            assert(!test_add.error)
        })
}