const userSchema = require('../models/user');
const jwt = require('jsonwebtoken')

const handleRefresh = async (req, res) => {
    const cookies = req.cookies;
    console.log("REFRESH cookies:", cookies)
    console.log("REFRESH jwt cookie:", cookies?.jwt)

    if(!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const foundUser =  await userSchema.findOne({ refreshToken: refreshToken });
    console.log(`REFRESH found user ${foundUser ? foundUser.username : null}`)

    if(!foundUser) {
        console.log('Refresh token not in db')
        return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
        {
            userId: foundUser._id,
            username: foundUser.username,
            role: foundUser.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m'}
    );

    return res.json({ accessToken })
}

module.exports = {handleRefresh}