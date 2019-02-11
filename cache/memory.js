module.exports = function (fetch_value) {

    let cache = new Map()

    let mem_fetch = (key) => {
        let mem_val = cache.get(key)
        if (mem_val) {
            return Promise.resolve(mem_val)
        } else {
            return fetch_value(key).then((fallback_val) => {
                cache.set(key, fallback_val)
                return fallback_val
            })
        }
    }

    return mem_fetch
}
