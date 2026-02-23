const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    const message = `${err.name}: ${err.message}\t${req.method}\t${req.originalUrl}`
    logEvents(message, "errLog.txt")

    console.error(err.stack)
    res.status(500).json({message: "Server Error"});
}

module.exports = errorHandler