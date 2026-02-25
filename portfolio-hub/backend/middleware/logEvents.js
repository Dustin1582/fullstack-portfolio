const { format } = require('date-fns');
const crypto = require('crypto');
const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'MMMDoyyyy\tHH:mm:ss')}`;
    const log = `${dateTime}\t${crypto.randomUUID()}\t${message}\n`;
    const pathDir = path.join(__dirname, "..", "logs")
    try {
        if(!fs.existsSync(pathDir)) {
            fsPromise.mkdir(pathDir)
        }
        await fsPromise.appendFile(path.join(pathDir, logFileName), log)
    } catch (error) {
        console.error(error)
    }
}


const logger = (req, res, next) => {
    const message = `${req.method}\t${req.originalUrl}\t${req.headers.origin || "no-origin"}`;
    logEvents(message, "reqLog.txt");
    next();
}

module.exports = {logEvents, logger}