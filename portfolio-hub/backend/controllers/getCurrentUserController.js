const userSchema = require('../models/user');

const me = async (req, res) => {
    const user = await userSchema.findById(req.userId).select("username createdAt");
    if(!user){
        console.error('User not found: ', req.name, req.header)
        return res.sendStatus(404);
    }

    return res.json({
        userId: user._id,
        username: user.username,
        createdAt: user.createdAt
    });
}

module.exports = { me }