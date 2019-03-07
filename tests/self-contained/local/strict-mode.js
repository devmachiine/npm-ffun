(test, assert) => {
    let strict = test("try assign without declaring first", () => {
        a = 10
    })
    return test("strict mode is enabled", () => {
        assert(!!strict.error, true)
        assert(strict.error.startsWith("ReferenceError: a is not defined"), true)
    })
}