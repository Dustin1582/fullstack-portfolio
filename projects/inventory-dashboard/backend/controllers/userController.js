const { json } = require("express");
const User = require("../models/user");

const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments({});
        return res.status(200).json({count: count})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const getProfile = await User.find().sort({usernameLowered: 1})
        res.status(200).json({message: "succeeded", json: getProfile})
    } catch (error) {
        console.error("User Controller (getUserProfile): ", error.message);
        return res.status(500).json({message: `Server Error: ${error.message}`})
    }
}

module.exports = {
  getUserCount, getUserProfile
};