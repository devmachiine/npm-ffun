const assert = (assumption, expected) => {
    if (typeof expected !== 'undefined') {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
    }
    else if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : value

const ok_result = (description) => {
    return { description: description }
}

const error_result = (description, err) => {
    return {
        description: description,
        error: '' + err,
        error_stack: err.stack
    }
}

const test = (description, func) => {
    try {
        func()
        return ok_result(description)
    } catch (err) {
        return error_result(description, err)
    }
}

const test_async = (description, promise, func) => promise
    .then(result => result)
    .catch(err => {
        err.message = 'Promise rejected >> ' + err.message
        throw err
    })
    .then((result) => func(result))
    .then(_ => ok_result(description))
    .catch(err => error_result(description, err))

const display_message = test => {
    let prefix = test.error ? 'error' : 'ok'
    let postfix = test.error ? ' --> ' + test.error : ''
    return `[${prefix}] ${test.description}${postfix}`
}

const result_text = test_result => {
    let short_message = display_message(test_result)
    let postfix_stack = test_result.error_stack ? '\nstack:\n' + test_result.error_stack : ''
    return `${short_message}${postfix_stack}`
}

const assert_test = (result, error_message) => {
    if (result.error != error_message) {
        let err = !error_message ? result.error :
            `test did not fail as expected. ${result.error ?
                `[${error_message}] === [${result.error}]` : 'No errors.'}`
        throw `\n [x] ${result.description}\n      --> ${err}`
    }
}

let tally_results = (...results) => {
    let ok_tests = 0, err_tests = 0, error_messages = ''
    results.forEach(result => {
        if (result.error) {
            error_messages += result_text(result)
            err_tests++
        } else if (!result.description) {
            error_messages += `\nNot a test result: ${result} ${JSON.stringify(result)}`
            err_tests++
        }
        else ok_tests++
    })
    let ss = n => n > 1 ? 's' : ''
    let overview = `${ok_tests} test${ss(ok_tests)} [ok] ${err_tests > 0 ? `..and ${err_tests} [error${ss(err_tests)}] ⚔️🔥` : '🌼'}`
    return { overview, error_messages }
}

module.exports = { assert, test, test_async, display_message, tally_results, assert_test };

