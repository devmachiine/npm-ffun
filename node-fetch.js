module.exports = function (httpsUrl) {

    const https = require('https');

    return new Promise((resolve, reject) => {

        https.get(httpsUrl, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => resolve(data));
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
        })
    });
}