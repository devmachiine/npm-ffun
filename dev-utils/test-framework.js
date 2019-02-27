const assert = (assumption, expected) => {
    if (expected) {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
    }
    else if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : value

const test = (description, func) => {
    try {
        func()
        return { description: description }
    } catch (err) {
        return { description: description, error: err }
    }
}

const display_message = test => {
    let prefix = test.error ? 'error' : 'ok'
    let postfix = test.error ? ' --> ' + test.error : ''
    return `[${prefix}] ${test.description}${postfix}`
}

const assert_test = (result, error_message) => {
    if (result.error != error_message) {
        let err = !error_message ? result.error :
            `test did not fail as expected. ${result.error ?
                `(${error_message} <--> ${result.error})` : 'No errors.'}`
        throw `\n [x] ${result.description}\n      --> ${err}`
    }
}

let tally_results = (...results) => {
    let ok_tests = 0, err_tests = 0, error_messages = ''
    results.forEach(result => {
        if (result.error) {
            error_messages += display_message(result)
            err_tests++
        }
        else ok_tests++
    })
    let ss = n => n > 1 ? 's' : ''
    let overview = `${ok_tests} test${ss(ok_tests)} [ok] ${err_tests > 0 ? `..and ${err_tests} [error${ss(err_tests)}] ⚔️🔥` : '🌼'}`
    return { overview, error_messages }
}

module.exports = { assert, test, display_message, tally_results, assert_test };

