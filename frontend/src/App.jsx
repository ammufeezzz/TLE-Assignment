import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import User from '../images/user.png'
import './App.css'

function App() {
const [studentData, setStudentData] = useState([]);
const [isForm,setIsForm]=useState(false);

useEffect(()=>{
  const fetchusers=async()=>{
    const data=await fetch("http://localhost:3000/users/getusers",{
      method:"GET",
      headers:{
        'Content-Type': 'application/json',
      },
    })
    const res=await data.json();

    setStudentData(res);
  }

  fetchusers();
},[])
  

  return (
    <div className='mx-12 mt-4 font-mono  '>
      <div className='flex justify-between'>

        <div className='flex items-center space-x-2'> 
          
          <img src={User} className='w-14 h-14'/>
          <h1 className='text-4xl font-bold '>Student Management</h1>

        </div>
        <div className='flex items-center space-x-2 '>
          <button onClick={()=>setIsForm(true)}className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer
'>Add Student + </button>
          <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer
'>Export Data</button>
        </div>
        

      </div>
      <div className='mt-4'>
        <StudentTable data={studentData}></StudentTable>
      </div>
      {/**the form will only be rendered when the user wants to add a student */}
      {isForm?<RenderForm ></RenderForm>:""}

    </div>


  )
}

function StudentTable({data}){
  return (
    <div className=' rounded-lg shadow-xl bg-white '>

      <table className='w-full divide-y divide-yellow-300 bg-'>
      <thead  className=' '>
        <tr  >
          {["Name","Email","Phone Number","CF Handle",'Current Rating',"Max Rating"].map((ele)=>(
            <th className='px-3 py-2 text-left'>
              {ele}
            </th>
          ))}

        </tr>
      </thead>
      <tbody className='divide-y divide-amber-400'>
        {data.map((item, index) => (
          <tr key={index}  >
            <td className='px-3 py-2'>{item.name}</td>
            <td className='px-3 py-2'>{item.email}</td>
            <td className='px-3 py-2'>{item.Phone_No}</td>
            <td className='px-3 py-2  underline'><a href={`https://codeforces.com/profile/${item.CF_Handle}`}>{`@${item.CF_Handle}`}</a></td>
            <td className='px-3 py-2'>{item.Current_Rating}</td>
            <td className='px-3 py-2'>{item.Max_Rating}</td>
          </tr>
        ))}
      </tbody>
    </table>

    </div>
    
  );
};


function RenderForm(){

  const [form,setForm]=useState({
    name:'',
    email:'',
    phone:'',
    cf_handle:'',
  })




  const handleChange=(e)=>{
    const {name,value}=e.target;
    setForm((prev)=>({
      ...prev,
      [name]:value
    }))
  }

  const  handleSubmit=async (e)=>{
    e.preventDefault();
    {/**here we send the data to the backend! */}
    const add=await fetch("http://localhost:3000/users/add",{
      method:'POST',
      body:JSON.stringify(form),
      headers:{
        'Content-Type': 'application/json',
      },

    })

    const res=await add.json();
    console.log(res);

  }







  return(
<div className="fixed inset-0 flex justify-center items-center opacity-95 bg-zinc-600  ">
  <form onSubmit={handleSubmit}>
    <div className="flex flex-col p-6 rounded-xl shadow-2xl text-lg bg-white space-y-4 w-96 border-blue-600 border-3">
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Name:</label>
      <input 
        type="text" name='name'onChange={handleChange}
        className="rounded-md border-2 border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
      />
    </div>

    <div className="flex flex-col">
      <label className="font-semibold mb-1">Email:</label>
      <input 
        type="email" name='email' onChange={handleChange}
        className="rounded-md border-2 border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
      />
    </div>

    <div className="flex flex-col">
      <label className="font-semibold mb-1">Phone Number:</label>
      <input 
        type="text" name='phone' onChange={handleChange}
        className="rounded-md border-2 border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
      />
    </div>

    <div className="flex flex-col">
      <label className="font-semibold mb-1">Codeforces Handle:</label>
      <input 
        type="text" name='cf_handle' onChange={handleChange}
        className="rounded-md border-2 border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" 
      />
    </div>
    <button type='submit' className='rounded-lg border-2 bg-blue-600 text-white px-2 py-1 hover:scale-105 hover:bg-blue-700'>Add</button>
  </div>

  </form>
  
</div>

  )

}


export default App
