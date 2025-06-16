import { useEffect, useState } from 'react'
import User from '../images/user.png'
import { SquarePen,Trash2,ChartNoAxesCombined,ChartNoAxesColumnDecreasing } from 'lucide-react';
import { LineChart } from '@mui/x-charts/LineChart';


import './App.css'

function App() {
  {/**now we will try to create the user specific page! */}
  const [activeTab, setActiveTab] = useState('contest');

  return (
    <div className='mx-12 mt-8 flex items-start font-mono space-x-12'>
      <div className='flex flex-col space-y-10 w-fit'>
        <UserCard username={"dev.t.prajapati"}></UserCard>
        <ContestStats username={"dev.t.prajapati"}></ContestStats>


      </div>

      <div className='w-full rounded-md h-full '>
        <div className='grid grid-cols-2 bg-zinc-100 '>
          <button onClick={()=>setActiveTab("contest")}className={`px-2 py-1 font-medium transition cursor-pointer ${activeTab === 'contest' ? 'bg-blue-100 text-blue-600  border-b-blue-600 border-b-2' : 'hover:bg-zinc-200'}`} >
            Contest History
          </button>
          <button onClick={()=>setActiveTab("problem")}   className={`${activeTab === 'problem' ? 'bg-blue-100 text-blue-600 border-b-blue-600 border-b-2' : 'hover:bg-zinc-200'} px-2 py-1 font-medium transition cursor-pointer  `}>Problem Solving</button>

        </div>

        <div className='mt-4 text-sm relative'>
          <select className='rounded-md border-1 border-zinc-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 absolute z-10 right-1 mt-2 mr-5.5 ' >
            <option >{activeTab==="contest"?'Last 30 days':'Last 7 days'}</option>
            <option >{activeTab==="contest"?'Last 90 days':'Last 30 days'}</option>
            <option >{activeTab==="contest"?'Last 365 days':'Last 90 days'}</option>
          </select>


         <ContestData username={"dev.t.prajapati"}></ContestData>


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
    <div className='rounded-2xl shadow-lg shadow-blue-300 font-mono  px-8 py-4 ring-2 ring-blue-400 bg-slate-100'>
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

function ContestStats() {
  return (
    <div className='grid grid-cols-2 gap-6'>
      <StatCard label="Contests Attended" value="10" />
      <StatCard label="Average Rating Change" value="+17" />
      <StatCard
        label="Best Rating Gain"
        value="+45"
        valueClass="text-green-500"
        icon={<ChartNoAxesCombined className="text-green-500 w-5 h-5" />}
      />
      <StatCard
        label="Worst Rating Drop"
        value="-69"
        valueClass="text-red-500"
        icon={<ChartNoAxesColumnDecreasing className="text-red-500 w-5 h-5" />}
      />
    </div>
  );
}

function ContestData({username}){
  const [contestData,setContestData]=useState([])
  const getContestData=async()=>{
    try{
      const response=await fetch(`https://codeforces.com/api/user.rating?handle=${username}`);
      if(!response.ok){
        throw new Error("Request Failed")
        
      }

      const data=await response.json();
      
      if(data.status!=='OK'){
        throw new Error("Error Fetching Data");
      }

      const date=new Date();
      const thirtyDaysAgo=date-30*24*60*60*1000;

      const last30=data.result.filter((item)=>{
        return (item.ratingUpdateTimeSeconds)*1000>=thirtyDaysAgo;
      })


      const ninetyDaysAgo=date-90*24*60*60*1000;

      const last90=data.result.filter((item)=>{
        return (item.ratingUpdateTimeSeconds)*1000>=ninetyDaysAgo;
      })

      const yearAgo=date-365*24*60*60*1000;

      const last365=data.result.filter((item)=>{
        return (item.ratingUpdateTimeSeconds)*1000>=yearAgo;
      })

      console.log(last365)

      setContestData(last365);







    }catch(err){
      console.error("error :",err);
    }
    {/**once we retrieve the contesr data we need to filter out in last 30,90 and 365 days   */}





  }

  useEffect(()=>{
      getContestData()
    },[])
  return (
    <div>
          <div className='rounded-2xl pt-6 pr-2 ring-2 ring-blue-400 '>
      <LineChart
      xAxis={[{ data: Array.from({length:(1,contestData.length)},(_,i)=>i),label:"Contest No" }]}
      yAxis={[
        {
          id: 'y-axis-id',
          label: 'Rating', // Y-axis label
        },
      ]}
      series={[
        {
          data: contestData.map((item)=>item.newRating),
          
        },
      ]}
      height={250}
      grid={{ vertical: true, horizontal: true }}
    />

    </div>
    <div className='rounded-md border-1 border-zinc-400 mt-4 overflow-y-auto max-h-[calc(100vh-430px)]'>
      <table className='w-full divide-y divide-slate-400 mt-2 '>
      <thead  className=' '>
        <tr className=''  >
          {["Contest","Rank","Rating Change","New Rating",'Problems Unsolved'].map((ele)=>(
            <th className='px-5 py-2 text-left' key={ele}>
              {ele}
            </th>
          ))}

        </tr>
        
      </thead>


        <tbody className='divide-y divide-slate-400'>
        {contestData.map((item, index) => (
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

function ProblemData({username}){
  return(
    <div></div>
  )
}



export default App
