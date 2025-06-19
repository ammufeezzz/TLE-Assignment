const User = require('../models/userModel');
const Contest=require('../models/contestModel');
const Problem=require('../models/problemModel')

async function contestStats(req,res){
    {/**here we will precalculate all the stats required to be shown based on the filter */}
    const handle=req.params.handle;
    const value=parseInt(req.query.days) || 30;

    const user=await User.findOne({CF_Handle:handle});

    {/**we find the user data and now we can apply filtering based on the value  */}

    const filter=Date.now()-value*60*60*24*1000

    const contests=await Contest.find({
        user:user._id,
    })
    
    const filteredData=contests.filter((c)=>{
        return c.Contest_Date*1000>=filter;
    })

    {/**this filters out based on the user selected value  */}


    const ratingChange=filteredData.map((item)=>item.newRating-item.oldRating);
    const averageChange=(ratingChange.reduce((sum,val)=>sum+val,0))/filteredData.length;

    const bestRatingGain=Math.max(...ratingChange)>0?Math.max(...ratingChange):0;
    const worstRatingDrop=Math.min(...ratingChange)<0?Math.min(...ratingChange):0;


    return res.json({
        contestsAttended:filteredData.length,
        averageChange:averageChange,
        bestRatingGain:bestRatingGain,
        worstRatingDrop:worstRatingDrop,
        rawData:filteredData
    })



    


    
}

module.exports={contestStats} 