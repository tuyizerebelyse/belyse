import React,{useState,useEffect} from 'react';
import axios from 'axios';

function Salary(){
    const[EmployeeID,setEmployeeID] = useState('');
      const[GrossSalary,setGrossSalary] = useState('');
       const[TotalDeduction,setTotalDeduction] = useState('');
         const[PaymentMonth,setPaymentMonth] = useState('');
         const[employee,setEmployee] = useState([]);
         useEffect(() =>{
axios.get("http://localhost:4000/fetchemp")
.then((res) =>setEmployee(res.data))
.catch((err) =>console.error(err));
         })

         const handlesubmit= async(e) =>{
            e.preventDefault();
            try{
                await axios.post("http://localhost:4000/salary",{EmployeeID,GrossSalary,TotalDeduction,PaymentMonth});
                alert("well inserted");
            }catch(err){
                console.log("not inserted:",err);
                alert("not inserted");
            }
         }
         return(
            <div>
            <form onSubmit={handlesubmit}>
            <select value={EmployeeID}onChange={(e) =>setEmployeeID(e.target.value)}>
            <option>choose employee</option>
            {employee.map((e) =>(
            <option key={e.EmployeeID} value={e.EmployeeID}>
            {e.EmployeeID} - {e.FirstName}
            </option>
            ))}
            </select><br/><br/>
          <input type='number' value={GrossSalary}onChange={(e) =>setGrossSalary(e.target.value)} placeholder='enter salary'required/><br/><br/>
          <input type='number' value={TotalDeduction}onChange={(e) =>setTotalDeduction(e.target.value)} placeholder='enter deduction'required/><br/><br/>
          <input type='date' value={PaymentMonth}onChange={(e) =>setPaymentMonth(e.target.value)} placeholder='enter month'required/><br/><br/>
          <input type= 'submit'/>
            </form>
            </div>
         )
}
export default Salary;