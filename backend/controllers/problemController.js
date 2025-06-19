const User = require('../models/userModel');
const Problem=require('../models/problemModel')

async function problemStats(req,res){
    {/**here we will precalculate all the stats required to be shown based on the filter */}
    const handle=req.params.handle;
    const value=parseInt(req.query.days) || 7;

    const user=await User.findOne({CF_Handle:handle});

    console.log(user)

    {/**we find the user data and now we can apply filtering based on the value  */}

    const filter=new Date()-value*60*60*24*1000

    const problems=await Problem.find({
        user:user._id
    })

    console.log(problems)

    const filteredData=problems.filter((item)=>{
        return item.Submission_Date*1000>=filter;
    })


    const problemsSolved=filteredData.filter((item)=>{
    {/**what if the user submits the same question 2 times???  */}
        return item.Verdict==='OK'
    })


    const problemsPerCategory=problemsSolved.reduce((freq,ele)=>{
        freq[ele.Rating]=(freq[ele.Rating] || 0) + 1;

        return freq;
    },{}) 


    const dataset = Object.entries(problemsPerCategory).map(([rating, value]) => ({
        rating,
        value,
    }));

    const submissionsData = new Map();

    for (let submission of filteredData) {
      const date = new Date(submission.Submission_Date * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; 
      const day = date.getDate();
      const submissionKey = `${year}-${month}-${day}`;

 
      submissionsData.set(submissionKey, (submissionsData.get(submissionKey) || 0) + 1);

    }

    console.log(submissionsData)



    const removeUndefined=Object.entries(problemsPerCategory).filter(([rating,num])=>{
        return rating!=="undefined"
    })

    const maxProblemRating=removeUndefined.map((problem)=>problem[0]);




    const averageProblemRating=removeUndefined.reduce((val,[rating,count])=>{
        return val+parseInt(rating)*count;
    },0)

    const totalSolved=removeUndefined.reduce((val,[_,count])=>val+count,0);


    res.json({
        problemsSolved:problemsSolved.length,
        averageProblemRating:Math.round((averageProblemRating/totalSolved)/100)*100,
        averageProblemsPerDay:(problemsSolved.length/value).toFixed(1),
        maxDifficult:Math.max(...maxProblemRating),
        submissionsData:Object.fromEntries(submissionsData),
        problemsPerCategory:dataset
    })


}
module.exports={problemStats} 