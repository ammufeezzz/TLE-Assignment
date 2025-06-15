function User(){
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
        <tr className=''  >
          {["Name","Email","Phone Number","CF Handle",'Current Rating',"Max Rating"].map((ele)=>(
            <th className='px-5 py-2 text-left' key={ele}>
              {ele}
            </th>
          ))}

        </tr>
      </thead>
      <tbody className='divide-y divide-slate-400'>
        {data.map((item, index) => (
          <tr key={index} className='transition-transform duration-150 ease-in  hover:scale-101 hover:border-3 hover:border-slate-400'  >
            <td className='px-5 py-2 '>{item.name}</td>
            <td className='px-5 py-2'>{item.email}</td>
            <td className='px-5 py-2'>{item.Phone_No}</td>
            <td className='px-5 py-2 font-bold'><a href={`https://codeforces.com/profile/${item.CF_Handle}`}>{`@${item.CF_Handle}`}</a></td>
            <td className='px-5 py-2'>{item.Current_Rating}</td>
            <td className='px-5 py-2'>{item.Max_Rating}</td>
            <td className='px-5 py-2 space-x-3'>
              <button className='text-blue-600 hover:text-blue-900 cursor-pointer' onClick={()=>onUpdate(item)}><SquarePen className='w-4 h-4'></SquarePen></button>
              <button className='text-red-600 hover:text-red-900 cursor-pointer' onClick={()=>handleDelete(item._id)} ><Trash2 className='w-4 h-4'></Trash2></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>



    </div>
    
  );

}