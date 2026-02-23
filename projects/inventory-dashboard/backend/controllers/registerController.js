const userSchema = require('../models/user');
const bcrypt = require('bcrypt')

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) return res.status(400).json({ message: 'Username and Password are required.'})
        
        const existingUser = await userSchema.findOne({ username })

        if(existingUser) return res.status(409).json({message: 'Username already exists'})
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const role = "user";
        const newUser = await userSchema.create({
            username,
            password: hashedPassword,
            role:role
        });

        return res.status(201).json({message: 'Registered User Successfully', userId: newUser._id})

    } catch (error) {
        console.error(error.stack)
        return res.status(500).json({message: error.message})
    }
}

module.exports = {registerUser}