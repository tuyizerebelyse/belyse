import React,{useState,useEffect} from 'react';
import axios from 'axios';
import Employee from './employee';
function Report1(){

         const[reportt,setReportt] = useState([]);
         useEffect(() =>{
axios.get("http://localhost:4000/reportemployee")
.then((res) =>setReportt(res.data))
.catch((err) =>console.error(err));
         })

       
         return(
           <div>
           <h2>Employee report</h2>
           <table border='1' cellPadding='2px'>
            <thead>
           <tr>
    
           <th>FirstName</th>
           <th>LastName</th>
           <th>position</th>
            <th>telephone</th>
             <th>Gender</th>
             <th>HiredDate</th>
           </tr>
            </thead>
            {reportt.map((row,index) =>(
                <tr key={index}>
                
                 <td>{row.FirstName}</td>
                  <td>{row.LastName}</td>
                   <td>{row.Position}</td>
                      <td>{row.Telephone}</td>
                       <td>{row.Gender}</td>
                        <td>{row. HiredDate }</td>
                </tr>
            ))}
           </table>
           </div>
         )
}
export default Report1;