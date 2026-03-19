const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
//environment variables
dotenv.config();

const app =express();

//middlewares

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));


//test route
app.get('/api/test',(req,res)=>{
    res.json({message:"congrats! your backend server is working fine"});
});

const connectDB=async()=>{
try{
    const conn=await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully${conn.connection.host}`); 
}catch(error){
    console.error("MongoDB connection error:",error);
    process.exit(1);
}
}
connectDB();

const PORT=process.env.PORT ||5000;

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
});

// const authRoutes = require('./routes/authRoutes');
// app.use('/api/auth', authRoutes);