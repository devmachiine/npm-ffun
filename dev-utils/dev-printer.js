module.exports = (printerOn = true) => (msg, show = true) => printerOn && show ? console.log(msg) : (_message) => 0
