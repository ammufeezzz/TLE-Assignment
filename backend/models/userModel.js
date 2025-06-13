const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    Phone_No : Number,
    CF_Handle: String,
    Current_Rating:Number,
    Max_Rating:Number,
});


module.exports=mongoose.model('User',userSchema);