let print = require('./dev-printer')()

const assert = (assumption) => {
    if (!eval(assumption))
        throw `Evaluation [${assumption}]`
}

const test = (description, func) => {
    try {
        func()
        print('[ok] ' + description)
        return true
    } catch (err) {
        print(`[error] ${description} \n --> ${err}`)
        return false
    }
}

// replace printer to capture output messages
print = (msg) => test_messages += '\n' + msg
let test_messages = "-".repeat(60)

let ok_test = test(`show [ok] on ok`, () => {
    let two = 2
    assert(`${two} == 2`)
})
let err_eval = test(`show evaluation on error`, () => {
    assert(`1 > 2`)
})
let err_throw = test(`show thrown error`, () => {
    throw 'ThrownError'
})
let err_eval_err = test(`show evaluation exception`, () => {
    assert(undefined_variable)
})

let ok_messages = test(`test functions show expected messages`, () => {
    let assert_message = (output) => assert(`${test_messages.includes(output)} && \`${output}\``)

    assert_message('[ok] show [ok] on ok')
    assert_message('[error] show evaluation on error')
    assert_message(' --> Evaluation [1 > 2]')
    assert_message('[error] show thrown error')
    assert_message(' --> ThrownError')
    assert_message('[error] show evaluation exception')
    assert_message(' --> ReferenceError: undefined_variable is not defined')
})

// restore printer
print = require('./dev-printer')()
test(`test functions tests yield expected results`, () => {
    assert(`${ok_test} && ${ok_messages}`)
    assert(`!(${err_eval} || ${err_throw} || ${err_eval_err})`)
})

