const mongoose = require('mongoose')

//schema defines the shape of a doc
const userSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    usernameLowered: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required:true,
    },
    refreshToken: {
        type:String
    }
}, {timestamps: true});

userSchema.pre("validate", function() {
    if(this.username){
        this.usernameLowered = this.username.trim().toLowerCase();
    }
});


module.exports = mongoose.model('User', userSchema)