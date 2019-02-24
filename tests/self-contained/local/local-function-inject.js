(test, assert) => {
    let factorial = ff('./tests/external-setup/factorial-hof-input.js')

    let multiply = ff('./tests/external-setup/multiply.js')

    let twenty_four = await factorial(4, multiply)

    let non_async_hof_awaited_without_error = await factorial(4, (x, y) => x * y)

    return test('local functions can send functions to other functions',
        () => {
            assert(`${twenty_four} == 24`)
            assert(`${twenty_four} === ${non_async_hof_awaited_without_error}`)
        })
}