const userSchema = require('../models/user');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const authUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        console.log("Login Body:", JSON.stringify(req.body, null, 2))
        console.log("Login Cookies:", JSON.stringify(req.cookies, null, 2))

        if(!username || !password) return res.status(400).json({message: 'Username and password are required.'});

        const foundUser = await userSchema.findOne({ username }).exec();
        if(!foundUser) {
            console.log("User not found!")
            return res.status(401).json({message: 'Invalid credientials'})
        }

        const passwordMatch = await bcrypt.compare(password, foundUser.password)
        if(!passwordMatch) {
            console.log("Login Failed: Bad Password")
            return res.status(401).json({message: 'Invalid credientials'})
        }
        
        const accessToken = jwt.sign(
            {
                userId: foundUser._id,
                username: foundUser.username,
                role: foundUser.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m'}
        )

        //creating refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        //storing in db
        foundUser.refreshToken = refreshToken
        await foundUser.save();
        const isProduction = process.env.NODE_ENV === "production"
        //sending token over httpOnly (js cant touch)
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        return res.status(200).json({ message: 'Logged in Successfully', accessToken})
        
    } catch (error) {
        console.error(error.stack)
        return res.status(500).json({message: error.message})
    }
};

module.exports = {authUser}