import { useEffect, useState } from 'react'
import User from '../images/user.png'
import { SquarePen,Trash2,ChartNoAxesCombined,ChartNoAxesColumnDecreasing } from 'lucide-react';
import { LineChart,BarChart } from '@mui/x-charts';


import './App.css'

function App({username}) {
  {/**now we will try to create the user specific page! */}
  const [activeTab, setActiveTab] = useState('contest');
  const [contestfilterDays,setContestFilterDays]=useState(30);
  const [problemFilterDays,setproblemFilterDays]=useState(7);
  const [contestData,setContestData]=useState([])
  const [rawContestData,setRawContestData]=useState(null);
  const [rawProblemData,setRawProblemData]=useState(null);



  {/**when we switch tabs, the data rendering is slow, maybe due to excessive api calls,maybe we can fetch all the data once when the component loads and set it as props for filtering and other things! */}

  const fetchdata=async()=>{
    try{
      const [contestRes,problemRes]=await Promise.all([
        fetch(`https://codeforces.com/api/user.rating?handle=tourist`),
        fetch(`https://codeforces.com/api/user.status?handle=tourist&from=1&count=100000000`)
      ])
      const ContestJson=await contestRes.json();
      const ProblemJson=await problemRes.json();
      
      setRawContestData(ContestJson.result);
      setRawProblemData(ProblemJson.result);
    }catch(err){
      console.error("error:",err);

    }


  }

  useEffect(()=>{
    fetchdata()
  },[])


  const handleChange=(event)=>{
    if(activeTab==="contest"){
      setContestFilterDays(parseInt(event.target.value));
    }else{
      setproblemFilterDays(parseInt(event.target.value));
    }

  }


  function filterdata(days,data){
    {/**this function takes num of days as a parameter and return the filtered data accordingly */}
    const curr_date=new Date();
    const filterdays=curr_date-(days)*24*60*60*1000;

    const filtered_data=data.filter((item)=>{
      return (item.ratingUpdateTimeSeconds?item.ratingUpdateTimeSeconds:item.creationTimeSeconds)*1000>=filterdays
    })

    return filtered_data 
    

  }

  return (
    <div className='mx-12 mt-8 flex items-stretch font-mono space-x-12'>
      <div className='flex flex-col space-y-10 max-w-[380px]'>
        <UserCard username={"ammufeezz"}></UserCard>
        <Stats stats={contestData} type={activeTab}></Stats>


      </div>

      <div className='flex flex-col flex-1'>
        <div className='grid grid-cols-2 bg-zinc-100 '>
          <button onClick={()=>setActiveTab("contest")}className={`px-2 py-1 font-medium transition cursor-pointer ${activeTab === 'contest' ? 'bg-blue-100 text-blue-600  border-b-blue-600 border-b-2' : 'hover:bg-zinc-200'}`} >
            Contest History
          </button>
          <button onClick={()=>setActiveTab("problem")}   className={`${activeTab === 'problem' ? 'bg-blue-100 text-blue-600 border-b-blue-600 border-b-2' : 'hover:bg-zinc-200'} px-2 py-1 font-medium transition cursor-pointer  `}>Problem Solving</button>

        </div>

        <div className='mt-4 text-sm relative'>
          <select onChange={handleChange} className='rounded-md border-1 border-zinc-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 absolute z-10 right-1 mt-2 mr-5.5 ' >
            <option value={activeTab==="contest"?30:7} >{activeTab==="contest"?'Last 30 days':'Last 7 days'}</option>
            <option value={activeTab==="contest"?90:30}>{activeTab==="contest"?'Last 90 days':'Last 30 days'}</option>
            <option value={activeTab==="contest"?365:90}>{activeTab==="contest"?'Last 365 days':'Last 90 days'}</option>
          </select>

          {/**here we send the selected filter as prop to the respecitve component! */}

          {activeTab==="contest" && rawContestData &&(
            <ContestData 
            rawData={rawContestData} 
            setContestData={setContestData}
            filter_days={contestfilterDays}
            filterdata={filterdata}
            >
            </ContestData>
          )}
          {activeTab==="problem" && rawProblemData &&(
            <ProblemData
            rawData={rawProblemData}
            filter_days={problemFilterDays}
            filterdata={filterdata}
            >

            </ProblemData>
          )
            
          }
          





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
        <span className={`${titleToColorClass[userData.rank]}`}>@<a href=''>{username}</a> <br></br> ({userData.rank})</span>
        <div className='flex space-x-6 text-sm'>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-bold'>Country:{userData.country}</span>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-medium'>Joined:{changedate(userData.registrationTimeSeconds
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

function Stats({stats,type}) {


  const ratingChange=stats.map((item)=>item.newRating-item.oldRating);
  const averageChange=(ratingChange.reduce((sum,val)=>sum+val,0))/stats.length





  
  
  return (
    <div className='grid grid-cols-2 gap-6'>
      <StatCard label={type==="contest"?"Contests Attended":"Problems Solved"} value={stats.length} />
      <StatCard label={type==="contest"?"Average Rating Change":"Average Rating"} value={Math.floor(averageChange)}  />
      <StatCard
        label={type==="contest"?"Best Rating Gain":"Average Problems/Day "}
        value={Math.max(...ratingChange)>0?Math.max(...ratingChange):0}
        valueClass="text-green-500"
        icon={<ChartNoAxesCombined className="text-green-500 w-5 h-5" />}
      />
      <StatCard
        label={type==="contest"?"Worst Rating Drop":"Most Difficult Problem Solved"}
        value={Math.min(...ratingChange)<0?Math.min(...ratingChange):0}
        valueClass="text-red-500"
        icon={<ChartNoAxesColumnDecreasing className="text-red-500 w-5 h-5" />}
      />
    </div>
  );
}

function ContestData({rawData,filter_days,setContestData,filterdata}){
  const [tableData,setTableData]=useState([])

  
  useEffect(()=>{
    console.log(rawData)
    if(rawData){
      const filtered=filterdata(filter_days,rawData)
      setTableData(filtered);
      setContestData(filtered)
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
            <td className='px-5 py-2'>{item.newRating-item.oldRating}</td>
            <td className='px-5 py-2 font-bold'>{item.newRating}</td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>



    



      


    </div>


    

  );
}

function ProblemData({rawData,filterdata,filter_days}){
  const [problemData,setProblemData]=useState([]);


  const problemsSolved=problemData.filter((item)=>{
    {/**what if the user submits the same question 2 times???  */}
    return item.verdict==='OK'
  })


  const problemsPerCategory=problemsSolved.reduce((freq,ele)=>{
    freq[ele.problem.rating]=(freq[ele.problem.rating] || 0) + 1;

    return freq;
  },{}) 


  const dataset = Object.entries(problemsPerCategory).map(([rating, value]) => ({
    rating,
    value,
  }));

  useEffect(()=>{
    if(rawData){
      const filtered=filterdata(filter_days,rawData);
      setProblemData(filtered)
    }
  },[filter_days,rawData])
  
  





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
          borderRadius={20}
          
        />

      </div>





    </div>
  )
}



export default App
