const express = require('express');
const router = express.Router();
const requireRole = require('../middleware/requireRole') 
const {inputIssue, getAllReports, deleteReport} = require('../controllers/issueController');

router.post("/issue-input", inputIssue);
router.get("/issue-report", requireRole("admin"), getAllReports);
router.delete("/issue-delete/:id", deleteReport)

module.exports = router;