const mongoose = require('mongoose');

const issues = mongoose.Schema({
    email: {
        type:String,
        required:true,
        trim:true
    },
    emailLowered: {
        type:String,
        required:true,
        trim:true
    },
    issueType: {
        type:String,
        required:true
    },
    issue: {
        type: String,
        required: true
    }
    
})

issues.pre("validate", function() {
    if(this.email){
        this.emailLowered = this.email.trim().toLowerCase();
    }
});

module.exports = mongoose.model('issues', issues)