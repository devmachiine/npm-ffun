module.exports = function (fetch_code) {
    let print = require('./dev-printer')()

    let build = (code) => {
        let fun = (new Function(`return (${code})`))();
        fun.ff = (treetop) => print('ff passing not ready for sir/lady ~' + treetop);
        return fun;
    }

    return function (resourcePath) {
        return fetch_code(resourcePath)
            .then((code) => {
                print('drew from cache : ' + code);
                return build(code);
            })
            .catch((oops) => {
                print('draw oops:' + oops);
            })
    }
}
