import { useEffect, useState } from 'react'
import { ChartNoAxesCombined,ChartNoAxesColumnDecreasing } from 'lucide-react';
import { LineChart,BarChart } from '@mui/x-charts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; 
import ReactTooltip from 'react-tooltip';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';





function IndividualStudent() {
  {/**now we will try to create the user specific page! */}
  const [activeTab, setActiveTab] = useState('contest');
  const [contestfilterDays,setContestFilterDays]=useState(30);
  const [problemFilterDays,setproblemFilterDays]=useState(7);
  const [contestData,setContestData]=useState([])
  const [rawContestData,setRawContestData]=useState(null);
  const [rawProblemData,setRawProblemData]=useState(null);
  const [loading,setLoading]=useState(true)
  const {username}= useParams()



  {/**when we switch tabs, the data rendering is slow, maybe due to excessive api calls,maybe we can fetch all the data once when the component loads and set it as props for filtering and other things! */}


  {/**right now on evry profile click, we are hitting the API, this reduces the efficiency of our app and is generally a very bad practice  */}

  const fetchdata=async()=>{
    setLoading(true);
    try{
      const [contestRes,problemRes]=await Promise.all([
        fetch(`http://localhost:3000/contests/${username}/contestStats?days=${contestfilterDays}`),
        fetch(`http://localhost:3000/problems/${username}/problemStats?days=${problemFilterDays}`)
      ])
      const ContestJson=await contestRes.json();
      const ProblemJson=await problemRes.json();

      {/**the thing with backend stored data is that ContestJson and ProblemJson will be having all the data we want to display */}

      
      setRawContestData(ContestJson);
      setRawProblemData(ProblemJson);
            setLoading(false);

    }catch(err){
      console.error("error:",err);

    }


  }

  useEffect(()=>{
    fetchdata()
  },[contestfilterDays,problemFilterDays])


  const handleChange=(event)=>{
    if(activeTab==="contest"){
      setContestFilterDays(parseInt(event.target.value));
    }else{
      setproblemFilterDays(parseInt(event.target.value));
    }

  }
  return (
    <div className='mx-12 mt-8 flex items-stretch font-mono space-x-12'>

      <div className='flex flex-col space-y-10 max-w-[380px]'>


        <UserCard username={username}></UserCard>
        <Stats stats={activeTab==="contest"?rawContestData:rawProblemData} type={activeTab} filter_days={problemFilterDays}></Stats>


        

        


      </div>

      <div className='flex flex-col flex-1'>
        <div className='flex justify-between w-full'>
          <div className='grid grid-cols-2 '>
          <button onClick={()=>setActiveTab("contest")}className={`px-2 py-1 font-medium transition cursor-pointer ${activeTab === 'contest' ? ' text-blue-600  border-b-blue-600 border-b-2' : 'hover:text-black text-zinc-500'}`} >
            Contest History
          </button>
          <button onClick={()=>setActiveTab("problem")}   className={`${activeTab === 'problem' ? ' text-blue-600 border-b-blue-600 border-b-2' : 'hover:text-black text-zinc-500'} px-2 py-1 font-medium transition cursor-pointer  `}>Problem Solving</button>


        </div>

          <select onChange={handleChange} className='rounded-md border-1 border-zinc-300 px-2 py-1 focus:ring-2 focus:ring-blue-500  mt-2 mr-5.5 text-sm' >
            <option value={activeTab==="contest"?30:7} >{activeTab==="contest"?'Last 30 days':'Last 7 days'}</option>
            <option value={activeTab==="contest"?90:30}>{activeTab==="contest"?'Last 90 days':'Last 30 days'}</option>
            <option value={activeTab==="contest"?365:90}>{activeTab==="contest"?'Last 365 days':'Last 90 days'}</option>
          </select>

        </div>


        <div className='mt-4 text-sm '>
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <CircularProgress />
            </div>
          ) : (
            <>
              {activeTab === "contest" && rawContestData && (
                <ContestData rawData={rawContestData} filter_days={contestfilterDays} />
              )}
              {activeTab === "problem" && rawProblemData && (
                <ProblemData rawData={rawProblemData} filter_days={problemFilterDays} />
              )}
            </>
          )}
</div>



      </div>

    </div>


  )



}

function UserCard({username}){
  {/**here we will create a card component to show student specific details */}
  const [userData,setuserData]=useState([]);

const titleToColorClass = {
  "newbie": "text-gray-400",
  "pupil": "text-green-400",
  "specialist": "text-cyan-400",
  "expert": "text-blue-400",
  "candidate master": "text-violet-400",
  "master": "text-orange-400",
  "international master": "text-orange-400",
  "grandmaster": "text-red-400",
  "international grandmaster": "text-red-400",
  "legendary grandmaster": "text-red-400"
};

  function changedate(data){
    const date=new Date(data*1000);
    
    return date.toLocaleDateString();
  }


  const fetchdata= async()=>{
    try{
      const response=await fetch(`https://codeforces.com/api/user.info?handles=${username}`);

      if(!response.ok){
        throw new Error("Request Failed")
        
      }
      const data=await response.json();

      if(data.status!=='OK'){
        throw new Error("Invalid Codeforces Credentials")
      }


      setuserData(data.result[0]);
    
    }catch(err){
      console.error("error:", err);
    }


  }

  useEffect(()=>{
    fetchdata()
  },[])
  



  return(
    <div className='rounded-2xl shadow-lg shadow-blue-300 font-mono px-6  py-4 ring-2 ring-blue-400 bg-slate-100'>
      <div className='flex flex-col items-center space-y-3'>
          <div className='rounded-full w-24 h-24  shadow-lg ring-2 ring-blue-300   '>
            <img src={userData.titlePhoto} className='w-full h-full rounded-full'/>
          </div>
        <span className='font-bold text-2xl'>{userData.firstName} {userData.lastName}</span>
        <span className={`${titleToColorClass[userData.rank]} text-center`}>@<a href=''>{username}</a> ({userData.rank})</span>
        <div className='flex space-x-6 text-sm'>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-bold text-center'>Country:{userData.country}</span>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-medium text-center'>Joined:{changedate(userData.registrationTimeSeconds
)}</span>
        </div>
        <span className='text-sm font-semibold'>Contest Rating: {userData.rating} (max: {userData.maxRating})</span>
      </div>
    </div>


  )


}

function StatCard({ label, value, icon, valueClass }) {
  return (
    <div className='rounded-2xl bg-white shadow-lg px-5 py-4 text-lg font-medium shadow-zinc-300 flex flex-col space-y-3 transition-transform duration-200 ease-in hover:scale-105 border-1 border-slate-300'>
      <span className='text-sm text-gray-500 font-medium'>{label}</span>
      <div className='flex justify-between items-center'>
        <span className={`text-2xl font-bold ${valueClass}`}>{value}</span>
        {icon && <div className="ml-2">{icon}</div>}
      </div>
    </div>
  );
}

function Stats({stats,type,filter_days}) {
  {/**problems Map gives us the eaxh rating to number of problems solved */};
  if (!stats) {
  return (
    <div className="text-center text-sm text-gray-500">Loading stats...</div>
  );
}

  const numberData = type === "contest" 
    ? stats.contestsAttended
    : stats.problemsSolved;

  const secondCard=type==="contest"?
  stats.averageChange:
  stats.averageProblemRating

  const thirdCard=type==="contest"?
  stats.bestRatingGain:
  stats.averageProblemsPerDay

  const fourthCard=type==="contest"?
  stats.worstRatingDrop:
  stats.maxDifficult

  return (
    <div className='grid grid-cols-2 gap-6'>
      <StatCard label={type==="contest"?"Contests Attended":"Problems Solved"} value={numberData} />
      <StatCard label={type==="contest"?"Average Rating Change":"Average Problem Rating"} value={secondCard}  />
      <StatCard
        label={type==="contest"?"Best Rating Gain":"Average Problems/Day "}
        value={thirdCard}
        valueClass={type==="contest"?"text-green-500":""}
        icon={type==="contest"?<ChartNoAxesCombined className="text-green-500 w-5 h-5" />:""}
      />
      <StatCard
        label={type==="contest"?"Worst Rating Drop":"Most Difficult Problem Solved"}
        value={fourthCard}
        valueClass={type==="contest"?"text-red-500":""}
        icon={type==="contest"?<ChartNoAxesColumnDecreasing className="text-red-500 w-5 h-5" />:""}
      />
    </div>
  );
}

function ContestData({rawData,filter_days}){
  const [tableData,setTableData]=useState([])

  
  useEffect(()=>{
    if(rawData){
      setTableData(rawData.rawData);
    }
  },[filter_days,rawData])

  return (
    <div >
          <div className='rounded-2xl pt-6 pr-2 ring-2 ring-blue-400 '>
      <LineChart
      xAxis={[{ data: Array.from({length:(tableData.length)},(_,i)=>i+1),label:"Contest No" }]}
      yAxis={[
        {
          id: 'y-axis-id',
          label: 'Rating', 
        },
      ]}
      series={[
        {
          data: tableData.map((item)=>item.newRating),
          
        },
      ]}
      height={250}
      grid={{ vertical: true, horizontal: true }}
    />

    </div>
    <div className='max-h-[280px] overflow-y-auto border-1 border-zinc-300 rounded-2xl mt-4 relative'>
       <table className='w-full divide-y divide-slate-400 mt-2 '>
      <thead  className='sticky top-0 bg-white z-10 '>
        <tr className=''  >
          {["Contest","Rank","Rating Change","New Rating",'Problems Unsolved'].map((ele)=>(
            <th className='px-5 py-2 text-left' key={ele}>
              {ele}
            </th>
          ))}

        </tr>
        
      </thead>


        <tbody className='divide-y divide-slate-400'>
        {tableData.map((item, index) => (
          <tr key={index} className='  '  >
            <td className='px-5 py-2 '>{item.contestName}</td>
            <td className='px-5 py-2'>{item.rank}</td>
            <td className='px-5 py-2'>{item.ratingChange}</td>
            <td className='px-5 py-2 font-bold'>{item.newRating}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>

    </div>


    

  );
}

function ProblemData({rawData,filter_days}){
  const [problemData,setProblemData]=useState(null);
  
  {/**using the above mapped data, we can now create submission heatmap for the respective days */}

  

  useEffect(()=>{
    if(rawData){
      setProblemData(rawData)
    }
  },[filter_days,rawData])

  // Wait until data is loaded
  if (!problemData) return null;

  // Fallbacks to empty values if fields are missing
  const submissionsData = problemData.submissionsData || {};
  const dataset = problemData.problemsPerCategory || [];

  

  return(
    <div className=''>
      <div className='rounded-2xl border-1 border-zinc-400'>

        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data:  dataset.map((item)=>item.rating),label:"Problem Rating"
              
            },
          ]}
          series={[
            {
              data: dataset.map((item)=>item.value),
            },
          ]}
          height={300}
          borderRadius={10}
          
          
        />




      </div>
      
      {Object.keys(submissionsData).length > 0 && (
        <CalendarHeatmap
          values={Object.entries(submissionsData).map(([date, count]) => ({ date, count }))}
          tooltipDataAttrs={value => ({ 'data-tip': `${value.date}: ${value.count} submissions` })}
          gutterSize={5}
        />
      )}




      {/**now i have to show the submission heatmap */}
      {/** we have to find out the number of submission made on the same day! */}





    </div>
  )
}



export default IndividualStudent