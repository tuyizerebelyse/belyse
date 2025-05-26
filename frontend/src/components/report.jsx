import React,{useState,useEffect} from 'react';
import axios from 'axios';
function Report(){

         const[report,setReport] = useState([]);
         useEffect(() =>{
axios.get("http://localhost:4000/report")
.then((res) =>setReport(res.data))
.catch((err) =>console.error(err));
         })

       
         return(
           <div>
           <h2>General report</h2>
           <table border='1' cellPadding='2px'>
            <thead>
           <tr>
    
           <th>FirstName</th>
           <th>LastName</th>
           <th>position</th>
            <th>Department</th>
            <th>GlossSalary</th>
            <th>TotalDeduction</th>
             <th>NetSalary</th>
             <th>PaymentMonth</th>
           </tr>
            </thead>
            {report.map((row,index) =>(
                <tr key={index}>
                
                 <td>{row.FirstName}</td>
                  <td>{row.LastName}</td>
                   <td>{row.Position}</td>
                    <td>{row.DepartmentName}</td>
                     <td>{row.GrossSalary}</td>
                      <td>{row.TotalDeduction}</td>
                       <td>{row.NetSalary}</td>
                        <td>{row. PaymentMonth }</td>
                </tr>
            ))}
           </table>
           </div>
         )
}
export default Report;