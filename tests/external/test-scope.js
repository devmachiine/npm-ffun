() => {
    // (framework) => {
    // let { test, assert } = framework
    return test('this function has simple access to outside scope', () => {
        print(`this shouldn't print.`)
    })
}