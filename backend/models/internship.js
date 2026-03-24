const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, "Please enter internship title"]  // ✅ required
    },
    company: {
        type: String,
        required: [true, "Please enter company name"]  // ✅ required
    },
    location: {
        type: String,
        default: "Remote"
    },
    type: {
        type: String,
        enum: ["Full-time", "Part-time", "Remote", "On-site"],
        default: "Remote"
    },
    description: {
        type: String,
        required: [true, "Please enter internship description"]  // ✅ required
    },
    requirements: [String],  // ✅ sahi
    salary: String,  // ✅ sahi
    resumeUsed: {
        type: String,
        default: null  // ✅ null, 'null' string nahi
    },
    coverLetterUsed: {
        type: String,
        default: null  // ✅ null
    },
    status: {
        type: String,
        enum: ["applied", "pending", "accepted", "rejected"],
        default: "pending"
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    deadline: Date,
    applicationLink: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);