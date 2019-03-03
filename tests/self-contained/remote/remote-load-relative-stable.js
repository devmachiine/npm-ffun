() => test('remote load remote relative - stable',
    (async () => {
        let stable_at_point_in_time = 'https://raw.githubusercontent.com/devmachiine/ffetch-test/be50423ffb17853bfeddc1268aff4dc582b50279/demo-functions/math/square.js'
        let twelve_squared = await ff(stable_at_point_in_time)(12)
        assert(twelve_squared, 144)
    }))
