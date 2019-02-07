module.exports = function (printerOn = true) {
    return printerOn ?
        (message) => {
            console.log(message);
            if (Math.random() < 0.1) {
                console.log(`it's super effective!`);
            }
        } : (_message) => { };
}
