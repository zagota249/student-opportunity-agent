const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    console.log('🔍 Register called with body:', req.body);
    
    try {
        const { name, email, password, confirmPassword } = req.body;  // ✅ YAHAN HONA CHAHIYE
        
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
        
        const newUser = await User.create({ name, email, password });
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
        
    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('📧 1. Login attempt for:', email);
        console.log('📧 2. Password received:', password);
        
        // ✅ IMPORTANT: .select('+password') must be here
        const user = await User.findOne({ email }).select('+password');
        
        console.log('📧 3. User found:', user ? 'YES' : 'NO');
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        console.log('📧 4. Stored hash exists:', user.password ? 'YES' : 'NO');
        console.log('📧 5. Comparing...');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        console.log('📧 6. Password match result:', isPasswordValid);
        
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
                email: user.email
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

            }
        });

    }
    catch(error){
        res.status(500).json({message:'Internal server error'});
    }
};

module.exports = { register, login,getprofile };