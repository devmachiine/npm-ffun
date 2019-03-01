(test, assert) => {

    let unstable_latest_and_greatest = 'https://raw.githubusercontent.com/devmachiine/ffetch-test/master/demo-functions/math/square.js'

    return test_async('remote load remote relative',
        ff(unstable_latest_and_greatest)(6),
        (six_squared) => {
            assert(six_squared, 36)
        })
}