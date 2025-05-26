import React,{useState,useEffect} from 'react';
import axios from 'axios';

function Report3(){

         const[reporttt,setReporttt] = useState([]);
         useEffect(() =>{
axios.get("http://localhost:4000/fetchs")
.then((res) =>setReporttt(res.data))
.catch((err) =>console.error(err));
         })

       
         return(
           <div>
           <h2>Salary report</h2>
           <table border='1' cellPadding='2px'>
            <thead>
           <tr>
           <th>GrossSalary</th>
           <th>TotalDeduction</th>
           <th>NetSalary</th>
            <th>PaymentMonth</th>
        
           </tr>
            </thead>
            {reporttt.map((row,index) =>(
                <tr key={index}>
                
                 <td>{row.GrossSalary}</td>
                  <td>{row.TotalDeduction}</td>
                   <td>{row.NetSalary}</td>
                      <td>{row.PaymentMonth}</td>
                    
                </tr>
            ))}
           </table>
           </div>
         )
}
export default Report3;