(framework) => {
    let { test, assert } = framework
    return test('this function has access to test methods', () => {
        assert(`${_outer_val} + 2 == 2`)
    })
}