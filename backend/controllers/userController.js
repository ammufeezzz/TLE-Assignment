const User = require('../models/userModel');


//this first API endpoint will allow to add users!

async function addUser(req,res){
    const {name,email,Phone_No,CF_Handle}=req.body;

    {/** once we get the data we send a request to the cf api, to fetch details regarding rating and max_rating */}
    const response=await fetch(`https://codeforces.com/api/user.info?handles=${CF_Handle}`)

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
            Phone_No:parseInt(Phone_No),
            CF_Handle:CF_Handle,
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

async function updateUsers(req,res){
    const {_id,name,email,Phone_No,CF_Handle}=req.body;

    {/**before updating we have to check if the user wants to update username then we can call the cf api */}

    const check=await User.findById(_id);
    if(!check) return res.status(400).json({message:"User does Not exist!"})

    const updateData = { name, email, Phone_No, CF_Handle };    

    if(check.CF_Handle!=CF_Handle){
        {/**here we know we have to call cf api and update the max rating and curr rating  */}
        const response=await fetch(`https://codeforces.com/api/user.info?handles=${CF_Handle}`)
        if(!response.ok){
            return res.status(400).json({error:"Failed to fetch Codeforces data! "})
        }
        const data=await response.json()

        if(data.status!=='OK'  || data.result.length === 0){
            return res.status(400).json({error:'Invalid Codeforced Credentials'})
        }
        updateData.Current_Rating=data.result[0].rating;
        updateData.Max_Rating=data.result[0].maxRating;
    }
    try{
        const user=await User.findByIdAndUpdate(_id,updateData,{new:true});
        {/**what if the user wants to update the  CF_Handle */}
        if(!user) return res.status(400).json({message:"User does not Exist"})
        
        return res.status(201).json({message:"User data updated successfully!"})    

    }catch(err){
        return res.status(400).json({error:err.message})
    }
}

async function deleteUser(req,res){
    
    const {_id}=req.body;

    

    try{
        const user=await User.findByIdAndDelete({_id});

        if(!user) return res.status(400).json({message:"User does not exist"})

        res.status(201).json({message:"User deleted successfully!"})    
    }catch(err){
        res.status(400).json({error:err.message});
        
    }

}
module.exports={addUser,getUsers,updateUsers,deleteUser} 