() => {
    let unstable_latest_and_greatest = 'https://raw.githubusercontent.com/devmachiine/ffetch-test/master/demo-functions/math/square.js'

    // note even though it points to master branch, cache version still behaved as expected.

    // todo ~ create tool that deletes selected functions/folders from cache
    // run tests to check behavior,
    // and on failure reverts function-relevant commits backwards till tests pass.

    return test('remote load remote relative - latest and who knows what changed',
        ff(unstable_latest_and_greatest)(6),
        (six_squared) => {
            let off_by_one_error = 1
            assert(six_squared, 36 + off_by_one_error)
        })
}