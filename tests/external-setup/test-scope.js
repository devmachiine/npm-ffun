(framework) => {
    let { test, assert } = framework
    return test('this function has simple access to outside scope', () => {
        assert(`${_outer_val} + 2 == 2`)
    })
}