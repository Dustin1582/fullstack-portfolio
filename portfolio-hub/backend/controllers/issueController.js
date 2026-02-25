const issues = require("../models/issues");
const normalizeText = require("../middleware/normalizeText");
const leoProfanity = require('leo-profanity');

const inputIssue = async (req, res) => {
    try {
        const {username, email, issueType, issue} = req.body;
    
        console.log(`Issue Variables:\nEmail: ${email}\nIssue Type: ${issueType}\nIssue: \n${issue}`);
    
        if(!username) {
            console.log("failed to retrieve username: ");
            return res.status(400).json({message: "Username Failed."});

        }
        if(!email) {
            console.log("missing email: ");
            return res.status(400).json({message: "Must include Email when sending information"});
        }
        
        if(!issueType) {
            console.log("missing issueType: ");
            return res.status(400).json({message: "Must include issueType when sending information"});
        } 
        
        if(!issue) {
            console.log("missing issue: ");
            return res.status(400).json({message: "Must include issue when sending information"});
        }
        
        const issueNormalized = normalizeText(issue);
        
        if(leoProfanity.check(issueNormalized)) {
            return res.status(400).json({message: "Profanity Detected"});
        }
        
        const emailLowered = email.toLowerCase();
    
        const createIssueReport = await issues.create({
            username: username,
            email: email,
            emailLowered: emailLowered,
            issueType: issueType,
            issue: issue
        });
        
        console.log("issue report created");

        res.status(200).json(createIssueReport);
    } catch (error) {
        console.log("Issue Report Error: ", error.message);
        return res.status(500).json({message: error.message})
    }

}


const getAllReports = async (req, res) => {
    try {
        const reports = await issues.find().sort({emailLowered: 1});
        return res.status(200).json(reports);
    } catch (error) {
        console.log("Get all reports Error: ", error.message);
        return res.status(500).json({message: error.message});
    }
}


const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await issues.findOneAndDelete({ _id: id})
    if(!deleted) return res.sendStatus(404).json({message: "issue id not found"});

    return res.sendStatus(200)
  } catch (error) {
    console.log("Delete Issue: ", error.message);
    return res.status(500).json({message: error.message})
  }
}

module.exports = {inputIssue, getAllReports, deleteReport}