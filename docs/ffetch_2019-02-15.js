module.exports = function (fetch_code) {
    
    fetch_code = require('../storage/cache-stack')(fetch_code)

    let build = (code) => new Function(`return (${code})`)();

    return (resourcePath) =>
        fetch_code(resourcePath).then((code) => build(code))
}
