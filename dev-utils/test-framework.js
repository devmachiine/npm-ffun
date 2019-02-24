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
    let total = 0, errors = 0, error_messages = ''
    results.forEach(result => {
        if (result.error) {
            error_messages += display_message(result)
            errors++
        }
        total++
    })
    let ss = n => n > 1 ? 's' : ''
    let overview = `Ran ${total} test${ss(total)}${errors > 0 ? ` with ${errors} error${ss(errors)} !!` : ' successfully.'}`
    return { overview, error_messages }
}

module.exports = { assert, test, display_message, tally_results, assert_test };

