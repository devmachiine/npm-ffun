(test, assert) => {
    let multiply = ff('./tests/external-setup/multiply.js')
    let hundred = await multiply(5, 20)

    return test('local functions can load other local functions', () => assert(`${hundred} == 100`))
}