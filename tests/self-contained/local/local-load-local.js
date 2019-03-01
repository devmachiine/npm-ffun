(test, assert) => {

    // direct reference
    let add = ff('./tests/external-setup/math/add.js')
    let twenty_five = await add(5, 20)

    // ff that itself calls ff  
    let square = ff('./tests/external-setup/math/square.js')
    let sixty_four = await square(8)

    return test('local functions can load other local functions', () => {
        assert(twenty_five, 25)
        assert(sixty_four, 64)
    })
}