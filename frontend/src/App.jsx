import { useEffect, useState } from 'react'
import User from '../images/user.png'
import { SquarePen,Trash2,ChartNoAxesCombined,ChartNoAxesColumnDecreasing } from 'lucide-react';

import './App.css'

function App() {
  {/**now we will try to create the user specific page! */}
  return (
    <div className='mx-12 mt-8 grid grid-cols-2 font-mono'>
      <div className='flex flex-col w-100 space-y-8'>
        <UserCard username={"jiangly"}></UserCard>
        <ContestStats></ContestStats>


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

      console.log(data)

      setuserData(data.result[0]);
    
    }catch(err){
      console.error("error:", err);
    }


  }

  useEffect(()=>{
    fetchdata()
  },[])
  



  return(
    <div className='w-100 rounded-2xl shadow-lg shadow-blue-300 font-mono  px-8 py-4 ring-2 ring-blue-400 bg-slate-100'>
      <div className='flex flex-col items-center space-y-3'>
          <div className='rounded-full w-24 h-24  shadow-lg ring-2 ring-blue-300   '>
            <img src={userData.titlePhoto} className='w-full h-full rounded-full'/>
          </div>
        <span className='font-bold text-2xl'>{userData.firstName} {userData.lastName}</span>
        <span className={`${titleToColorClass[userData.rank]}`}>@<a href=''>{username}</a> ({userData.rank})</span>
        <div className='flex space-x-6 text-sm'>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-bold'>Country:{userData.country}</span>
          <span className='rounded-2xl bg-zinc-300 px-2 py-1 font-medium'>Joined:{changedate(userData.registrationTimeSeconds
)}</span>
        </div>
        <span className='text-sm font-semibold'>Contest Rating: {userData.rating} (max. {userData.maxRank}, {userData.maxRating})</span>
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



export default App
