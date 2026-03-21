const { application } = require('express');
const mongoose= require('mongoose');


const internshipSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        require:[true,"Please enter internship title"]
    },
    company:{
        type:String,
        require:[true,"Please enter company name"]
    },
    location:{
        type:String,
        default:"Remote"
    },
    type:{
        type:String,
        enum:["Full-time","Part-time","Remote","On-site"],
        default:"Remote"

    },
    description:{
        type:String,
        require:[true,"Please enter internship description"]

    }, 
    requirements:[string],salary:string,
    resumeused:{
        type:String,
        default:'null'

    },
    coverletterused:{
        type:String,
        default:'null'

    },
    status:{
        type:String,
        enum:["applied","pending","accepted","rejected"],
        default:"pending"
    },
    appliedAt:{
        type:Date,
        default:Date.now
    },
    deadline:Date,
    applicationlink:String,
},{
    timestamps:true


});


module.exports=mongoose.model('Internship',internshipSchema);