const mongoose = require('mongoose');

const problemSchema=new mongoose.Schema({
    contestId:Number,
    id:Number,
    Submission_Date:Number,
    Rating:String,
    Verdict:String,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }



})

module.exports=mongoose.model('Problem',problemSchema);
