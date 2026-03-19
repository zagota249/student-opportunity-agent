const mongoose=require('mongoose');
const validater=require('validator');
const bcrypt=require('bcryptjs');

//name,email,password,photo,skills,confirmPassword,resume
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:[true,"please enter your name"]
    },
    email:{
        type: String,
        required:[true,"please enter your email"],
        unique:true,
        lowercase:true,
        validate:[validater.isEmail,"please enter a valid email"]
    },
    photo:String,
    password:{
        type: String,
        required:[true,"please enter your password"],
        minlength:[8,"password must be at least 8 characters long"]

    },
    skills:[String],
    education:{
        degree:String,
        institution:String,
        yearOfGraduation:Number


    },
    resume:String,
    createdAt:{
        type:Date,
        default:Date.now()


    }
    
    


});



userSchema.virtual('confirmPassword')
.get(function(){
    return this._confirmPassword;})
.set(function(value){
    this._confirmPassword=value;
});
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();  
    

    
    this.password = await bcrypt.hash(this.password, 12);
    this._confirmPassword = undefined;
    return next();
});


userSchema.methods.comparePassword=async function (candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
    
};


const User=mongoose.model('User',userSchema);

module.exports=User;



