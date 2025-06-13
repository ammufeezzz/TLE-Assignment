const User = require('../models/userModel');


//this first API endpoint will allow to add users!

async function addUser(req,res){
    const {name,email,phone,cf_handle}=req.body;

    {/** once we get the data we send a request to the cf api, to fetch details regarding rating and max_rating */}
    const response=await fetch(`https://codeforces.com/api/user.info?handles=${cf_handle}`)

    if(!response.ok){
        return res.status(400).json({error:"Failed to fetch Codeforces data! "})
    }
    const data=await response.json()

    if(! data.status==='0K'  || data.result.length === 0){
        res.status(400).json({error:'Invalid Codeforced Credentials'})
    }


    const rating=data.result[0].rating;
    const max_rating=data.result[0].maxRating;



    {/**now we can insert all the data into the db */}
    try{
        const newuser=await User.create({
            name:name,
            email:email,
            Phone_No:parseInt(phone),
            CF_Handle:cf_handle,
            Current_Rating:rating,
            Max_Rating:max_rating




        })
        res.status(201).json({message:"User added succesfully"})
    }catch(err){
        res.status(400).json({error:err.message})



}}

async function getUsers(req,res){
    {/**this endpoint is used to display all the users enrolled  */}
    try{
        const Users=await User.find(); 
        res.status(200).json(Users)
    }catch(err){
        res.status(400).json({error:err.message})
    }
}
module.exports={addUser,getUsers} 