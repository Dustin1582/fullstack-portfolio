const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    console.log('JWT AUTH HEADERS: ', authHeaders)
    console.log("cookies:", req.cookies);

    if(!authHeaders || !authHeaders.startsWith('Bearer')) return res.sendStatus(401); //
    const token = authHeaders.split(' ')[1]; //gets the second part of the header
    console.log(`TOKEN LENGTH: ${token ? token.length : "MISSING"}` )

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                console.log(`JWT ERROR: ${err.name} ${err.message}`)
                return res.sendStatus(403);
            } //unauthorized
            req.userId = decoded.userId;
            req.username = decoded.username;
            req.role = decoded.role;

            next();
        }
    );
};

module.exports = verifyJWT