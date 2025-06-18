import { useEffect, useState } from 'react'
import { SquarePen,Trash2 } from 'lucide-react';
import User from '../images/user.png'




import './App.css'

function App() {
const [studentData, setStudentData] = useState([]);
const [isForm,setIsForm]=useState(false);
const [selectedStudent,setselectedStudent]=useState(null);

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


  useEffect(()=>{
      fetchusers();


  },[])

  const addStudent=()=>{
    setIsForm(true);
    setselectedStudent(null);
  }

  const updateStudent=(data)=>{
    {/**data is the data of the student to be updated!` */}

    setIsForm(true);
    setselectedStudent(data)
  }


  return (
    <div className='mx-12 mt-4 font-mono  '>
      <div className='flex justify-between'>

        <div className='flex items-center space-x-2'> 

          <img src={User} className='w-14 h-14'/>
          <h1 className='text-4xl font-bold '>Student Management</h1>

        </div>
        <div className='flex items-center space-x-2 '>
          <button onClick={addStudent}className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer
'>Add Student + </button>
          <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded cursor-pointer
'>Export Data</button>
        </div>


      </div>
      <div className='mt-4'>
        <StudentTable data={studentData} onUpdate={updateStudent} fetchusers={fetchusers} ></StudentTable>
      </div>
      {/**the form will only be rendered when the user wants to add a student */}
      {isForm&&<RenderForm initialData={selectedStudent} closeForm={() => setIsForm(false)} fetchusers={fetchusers} />}

    </div>


  )
}

function StudentTable({data,onUpdate,fetchusers}){


  const handleDelete=async(id)=>{
    let response;
    console.log(typeof(id))
    response=await fetch("http://localhost:3000/users/deleteUser",{
      method:'DELETE',
      body:JSON.stringify({_id:id}),
      headers:{
          'Content-Type':'application/json'
        }

    })
    const resdata=await response.json();

    console.log(resdata)
    fetchusers();
  }





  return (
    <div className=' rounded-lg shadow-xl bg-white '>

      <table className='w-full divide-y divide-slate-400 '>
      <thead  className=' '>
        <tr  >
          {["Name","Email","Phone Number","CF Handle",'Current Rating',"Max Rating"].map((ele)=>(
            <th className='px-3 py-2 text-left' key={ele}>
              {ele}
            </th>
          ))}

        </tr>
      </thead>
      <tbody className='divide-y divide-slate-400'>
        {data.map((item, index) => (
          <tr key={index}  >
            <td className='px-3 py-2 '>{item.name}</td>
            <td className='px-3 py-2'>{item.email}</td>
            <td className='px-3 py-2'>{item.Phone_No}</td>
            <td className='px-3 py-2 font-bold'><a href={`https://codeforces.com/profile/${item.CF_Handle}`}>{`@${item.CF_Handle}`}</a></td>
            <td className='px-3 py-2'>{item.Current_Rating}</td>
            <td className='px-3 py-2'>{item.Max_Rating}</td>
            <td className='px-3 py-2 space-x-3'>
              <button className='text-blue-600 hover:text-blue-900 cursor-pointer' onClick={()=>onUpdate(item)}><SquarePen className='w-4 h-4'></SquarePen></button>
              <button className='text-red-600 hover:text-red-900 cursor-pointer' onClick={()=>handleDelete(item._id)} ><Trash2 className='w-4 h-4'></Trash2></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>



    </div>

  );
};


function RenderForm({closeForm,fetchusers,initialData=null}){






  const [form,setForm]=useState({
    name:'',
    email:'',
    Phone_No:'',
    CF_Handle:'',
  })

  useEffect(()=>{
    if(initialData){
      setForm({
        _id:initialData._id,
        name:initialData.name,
        email: initialData.email,
        Phone_No: initialData.Phone_No,
        CF_Handle: initialData.CF_Handle,
      })

    }

  },[initialData])






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
    {/**here i'm hardcoding the student enrollments,obviously in a working env that wont be the case! */}

    let response;

    if(initialData){
      response=await fetch("http://localhost:3000/users/updateUser",{
        method:'PUT',
        body:JSON.stringify(form),
        headers:{
          'Content-Type':'application/json'
        }
      })
    }else{
      response=await fetch("http://localhost:3000/users/add",{
      method:'POST',
      body:JSON.stringify(form),
      headers:{
        'Content-Type': 'application/json',
      },

    })

    }

    const resdata=await response.json();

    console.log(resdata)


    closeForm();
    fetchusers();

  }

const fields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Email', name: 'email', type: 'email' },
  { label: 'Phone Number', name: 'Phone_No', type: 'text' },
  { label: 'Codeforces Handle', name: 'CF_Handle', type: 'text' }
];

return (
  <div className="fixed inset-0 flex justify-center items-center opacity-95 bg-zinc-600">
    <form onSubmit={handleSubmit} className='relative'>
      <button 
        type='button' 
        onClick={closeForm} 
        className='rounded-full border border-blue-300 p-2 w-12 h-12 font-extrabold absolute -right-5 -top-5 z-10 text-2xl bg-blue-600 text-white cursor-pointer shadow-lg hover:bg-blue-700 hover:border-blue-400'
      >
        X
      </button>

      <div className="flex flex-col p-6 rounded-xl shadow-2xl text-lg bg-white space-y-4 w-96 border-blue-600 border-3">

        {fields.map((field) => (
          <div className="flex flex-col" key={field.name}>
            <label className="font-semibold mb-1">{field.label}:</label>
            <input 
              value={form[field.name]}
              type={field.type}
              name={field.name}
              onChange={handleChange}
              className="rounded-md border-2 border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        ))}

        <button 
          type='submit' 
          className='rounded-lg border-2 bg-blue-600 text-white px-2 py-1 hover:scale-105 hover:bg-blue-700'
        >
          {initialData!=null?"Update":"Add"}
        </button>

      </div>
    </form>
  </div>
)

}

export default App
