(framework) => {
    let { test, assert } = framework
    return test("test passed", assert(true, true))
}