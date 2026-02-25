const userSchema = require('../models/user');

const logout = async (req, res) => {
    const cookies = req.cookies;

    if(!cookies.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const foundUser = await userSchema.findOne({ refreshToken }).exec();
    if(!foundUser) return res.sendStatus(403);

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    });

    return res.sendStatus(204);
}

module.exports = { logout }