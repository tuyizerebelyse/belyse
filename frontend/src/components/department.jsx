import React,{useState} from 'react';
import axios from 'axios';



function Department(){
    const[DepartmentCode,setDepartementCode] = useState('');
      const[DepartmentName,setDepartementName] = useState('');

      const handlesubmit= async(e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:4000/department",{DepartmentCode,DepartmentName});
            alert('department inserted');
        }catch(err){
            console.error("error occured:",err);
            alert("failed to insert department")
        }
      }
  return (
    <div>
    <form onSubmit={handlesubmit}>
    <h5> ADD DEPARTMENT</h5>
     <input type='number' value={DepartmentCode}onChange={(e) =>setDepartementCode(e.target.value)} placeholder='enter code'required/>
          <input type='text' value={DepartmentName}onChange={(e) =>setDepartementName(e.target.value)} placeholder='enter dname'required/>
          <input type='submit'/>
    </form>
      
    </div>
  )
}

export default Department;

