import React,{useState,useEffect} from 'react';
import axios from 'axios';


function Employee(){
const[FirstName,setFirstName] = useState('');
const[LastName,setLastName] = useState('');
const[Address,setAddress] = useState('');
const[Position,setPosition] = useState('');
const[Telephone,setTelephone] = useState('');
const[Gender,setGender] = useState('');
const[HiredDate,setHiredDate] = useState('');
const[DepartmentCode,setDepartementCode] = useState('');
const[department,setDepartement] = useState([]);
useEffect(() =>{
  axios.get("http://localhost:4000/fetch")
  .then((res) =>setDepartement(res.data))
  .catch((err) =>console.error(err));
})


const handlesubmit= async(e)=>{
    e.preventDefault();
    try{
           await axios.post("http://localhost:4000/employee",{FirstName,LastName,Address,Position,Telephone,Gender,HiredDate,	DepartmentCode	})
    alert('employee added')
}catch(err){
    console.error("empolyee failed",err)
    alert("insert failed")
}
    }

    

  return (
    <div>
      <form onSubmit={handlesubmit}>
      <h4><u>ADD EMPLOYEE</u></h4>
      <select value={DepartmentCode}onChange={(e) =>setDepartementCode(e.target.value)}>
      <option>choose department code</option>
      {department.map((d) =>(
        <option key={d.DepartmentCode} value={d.DepartmentCode}>
        {d.DepartmentCode} - {d.DepartmentName}
        </option>
      ))}
      </select><br/><br/>
      <input type='text' value={FirstName}onChange={(e) =>setFirstName(e.target.value)} placeholder='enter fist name'required/><br/><br/>
          <input type='text' value={LastName}onChange={(e) =>setLastName(e.target.value)} placeholder='enter last name'required/><br/><br/>
          <input type='text' value={Address}onChange={(e) =>setAddress(e.target.value)} placeholder='enter address'required/><br/><br/>
          <input type='text' value={Position}onChange={(e) =>setPosition(e.target.value)} placeholder='enter position'required/><br/><br/>
          <input type='number' value={Telephone}onChange={(e) =>setTelephone(e.target.value)} placeholder='enter telephone'required/><br/><br/>
          <input type='text' value={Gender}onChange={(e) =>setGender(e.target.value)} placeholder='enter gender'required/><br/><br/>
          <input type='date' value={HiredDate}onChange={(e) =>setHiredDate(e.target.value)} placeholder='enter hired date'required/><br/><br/>
         
          <input type='submit'/>
      </form>
    </div>
  )
}

export default Employee;

