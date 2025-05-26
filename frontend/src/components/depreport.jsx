import React,{useState,useEffect} from 'react';
import axios from 'axios';
function Report2(){

         const[reporttt,setReporttt] = useState([]);
         useEffect(() =>{
axios.get("http://localhost:4000/dep")
.then((res) =>setReporttt(res.data))
.catch((err) =>console.error(err));
         })

       
         return(
           <div>
           <h2>Department report</h2>
           <table border='1' cellPadding='2px'>
            <thead>
           <tr>
    
           <th>Department code</th>
           <th>Department name</th>
        
           </tr>
            </thead>
            {reporttt.map((row,index) =>(
                <tr key={index}>
                
                 <td>{row.DepartmentCode }</td>
                  <td>{row.DepartmentName}</td>
                   
                </tr>
            ))}
           </table>
           </div>
         )
}
export default Report2;