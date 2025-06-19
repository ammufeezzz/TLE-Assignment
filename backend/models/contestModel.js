const mongoose = require('mongoose');

const contestSchema=new mongoose.Schema({
    contestId:Number,
    contestName:String,
    oldRating:Number,
    newRating:Number,
    Contest_Date:Number,
    ratingChange:Number,
    rank:Number,

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }



})

module.exports=mongoose.model('Contest',contestSchema);