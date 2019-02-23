module.exports = function (https_url) {
    const https = require('https')
    return new Promise((resolve, reject) => {

        https.get(https_url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => resolve(data));
        }).on("error", (err) => reject(err))
    });
}
