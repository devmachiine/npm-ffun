module.exports = function (fetch_code) {
    if (typeof fetch_code !== "string")
        throw ('require(ff)(directory-string)')

    fetch_code = require('./cache-barrel')(fetch_code)

    let build = (code) => new Function(`return (${code})`)();

    return (resourcePath) =>
        fetch_code(resourcePath).then((code) => build(code))
}
