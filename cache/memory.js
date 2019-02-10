module.exports = function (fetch_value) {

    let print = require('../dev-printer')(false)
    
    print('create memory cache')
    let cache = new Map()

    let mem_fetch = (key) => {
        let mem_val = cache.get(key)
        if (mem_val) {
            print('mem retrieved : ' + mem_val)
            return Promise.resolve(mem_val)
        } else {
            print('mem seek :' + key)
            return fetch_value(key).then((fallback_val) => {
                cache.set(key, fallback_val)
                print('mem saved & returned : ' + fallback_val)
                return fallback_val
            })
        }
    }

    return mem_fetch
}

// todo perf test does key size matter?