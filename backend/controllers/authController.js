const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, linkedinEmail, linkedinPassword, indeedEmail, indeedPassword } = req.body;

        // Validate required fields
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please provide name, email, password and confirmPassword" });
        }

        // Validation
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newUser = await User.create({ name, email, password, linkedinEmail, linkedinPassword, indeedEmail, indeedPassword });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                linkedinEmail: newUser.linkedinEmail,
                indeedEmail: newUser.indeedEmail
            }
        });

    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Request body is empty. Make sure you're sending JSON with Content-Type: application/json"
            });
        }
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // ✅ IMPORTANT: .select('+password') must be here
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                linkedinEmail: user.linkedinEmail,
                indeedEmail: user.indeedEmail
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getprofile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json({
            success:true,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                skills:user.skills,
                education:user.education,
                linkedinEmail: user.linkedinEmail,
                indeedEmail: user.indeedEmail

            }
        });

    }
    catch(error){
        res.status(500).json({message:'Internal server error'});
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, skills, education, linkedinEmail, linkedinPassword, indeedEmail, indeedPassword } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (skills) updateData.skills = skills;
        if (education) updateData.education = education;
        if (linkedinEmail) updateData.linkedinEmail = linkedinEmail;
        if (linkedinPassword) updateData.linkedinPassword = linkedinPassword;
        if (indeedEmail) updateData.indeedEmail = indeedEmail;
        if (indeedPassword) updateData.indeedPassword = indeedPassword;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                skills: user.skills,
                education: user.education,
                linkedinEmail: user.linkedinEmail,
                indeedEmail: user.indeedEmail
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { register, login, getprofile, updateProfile };