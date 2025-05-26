import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/register";
import Employee from "./components/employee";
import Department from "./components/department";
import Salary from "./components/salary";
import Report from "./components/report";
import Report1 from "./components/repemployee";
import Report2 from "./components/depreport";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Report3 from "./components/salary report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Login/>} />
      <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Register/>} />
         <Route path="/d" element={<Dashboard/>} >
       
             <Route path="department" element={<Department/>}/>
           
              <Route path="salary" element={<Salary/>} />
            <Route path="report" element={<Report/>} />
              <Route path="report1" element={<Report1/>} />
               <Route path="report2" element={<Report2/>} />
                  <Route path="employee" element={<Employee />} />
                     <Route path="report3" element={<Report3/>} />
             </Route>
         
                
      </Routes>
    </Router>
  );
}

export default App;
