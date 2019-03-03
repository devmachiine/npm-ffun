const quote_wrap = (value) => typeof value === 'string' ? `'${value}'` : value

const assert = (assumption, expected) => {
    if (typeof expected !== 'undefined') {
        if (assumption !== expected)
            throw `Evaluation [${quote_wrap(assumption)}] === [${quote_wrap(expected)}]`
    }
    else if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

let assert_fun = (assumption, message) => {
    try {
        if (!assumption())
            throw false
    } catch (err) {
        let err_prefix = err ? `!! Test failed *before* assertion --> ` + err : ''
        let message_prefix = message ? (err_prefix ? '\n\t--> ' : '') + message : ''
        throw `${err_prefix}${message_prefix} \n\t--> Evaluation[${assumption}]`
    }
}

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

const test = (description, func, then_func = x => x) =>
    typeof func === 'function' ?
        test_direct(description, func, then_func)
        : test_async(description, func, then_func)


const test_direct = (description, func, then_func) => {
    try {
        then_func(func())
        return ok_result(description)
    } catch (err) {
        return error_result(description, err)
    }
}

const test_async = (description, promise, then_func = x => x) => promise
    .then(result => result)
    .catch(err => {
        err.message = 'Promise rejected >> ' + err.message
        throw err
    })
    .then((result) => then_func(result))
    .then(_ => ok_result(description))
    .catch(err => error_result(description, err))

const display_message = test => {
    let prefix = test.error ? 'error' : 'ok'
    let postfix = test.error ? '\n\t--> ' + test.error : ''
    return `[${prefix}] ${test.description}${postfix}`
}

const result_text = test_result => {
    let short_message = display_message(test_result)
    let postfix_stack = test_result.error_stack ? '\nstack:\n' + test_result.error_stack : ''
    return `${short_message}${postfix_stack}`
}

let tally_results = (name, ...results) => {
    if (typeof name !== 'string') {
        results.unshift(name)
        name = ''
    } else {
        name += " "
    }
    let ok_tests = 0, err_tests = 0, error_messages = ''
    results.forEach(result => {
        if (!result || !result.description) {
            error_messages += `\nNot a test result: ${result} ${JSON.stringify(result)}`
            err_tests++
        }
        else if (result.error) {
            error_messages += `\n${result_text(result)}`
            err_tests++
        }
        else ok_tests++
    })
    let ss = n => n > 1 ? 's' : ''
    let overview = `${ok_tests} test${ss(ok_tests)} [ok] ${err_tests > 0 ? `..and ${err_tests} [error${ss(err_tests)}] ⚔️🔥` : '🌼'}`
    return `${name}${overview}\n${error_messages}`
}

module.exports = { assert, assert_fun, test, display_message, tally_results };

