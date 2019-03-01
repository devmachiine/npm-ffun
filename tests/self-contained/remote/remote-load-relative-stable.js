(test, assert) => {

    let stable_at_point_in_time = 'https://raw.githubusercontent.com/devmachiine/ffetch-test/be50423ffb17853bfeddc1268aff4dc582b50279/demo-functions/math/square.js'

    return test_async('remote load remote relative',
        ff(stable_at_point_in_time)(12),
        (twelve_squared) => {
            assert(twelve_squared, 144)
        })
}