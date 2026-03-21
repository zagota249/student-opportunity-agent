const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false
    },
    skills: [String],
    education: {
        degree: String,
        institution: String,
        yearOfGraduation: Number
    },
    resume: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    coverLetter: {
        type: String,
        default: null
    }
});

// Virtual field for confirmPassword
userSchema.virtual('confirmPassword')
    .get(function() { return this._confirmPassword; })
    .set(function(value) { this._confirmPassword = value; });

// Pre-save middleware to hash password
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
    this._confirmPassword = undefined;
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;