(test, assert) => {
    let factorial = ff('./tests/external/factorial-hof-output.js')

    let await_and_call = (await factorial())(3)

    let factorial_function = await factorial()

    let six = factorial_function(3)

    return test('local functions can retrieve other functions',
        () => {
            assert(six, 6)
            assert(await_and_call, 6)
        })
}