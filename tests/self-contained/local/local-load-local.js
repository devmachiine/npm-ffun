(test, assert) => {

    // direct reference
    let add = ff('./tests/external/math/add.js')
    let twenty_five = await add(5, 20)

    // ff that itself calls ff  
    let cube = ff('./tests/external/math/cube.js')
    let thousand = await cube(10)

    return test('local functions can load other local functions', () => {
        assert(twenty_five, 25)
        assert(thousand, 1000)
    })
}