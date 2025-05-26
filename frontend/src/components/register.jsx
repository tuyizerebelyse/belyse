import React,{ useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './reg.css';

function Register(){

const[username,setUsername] = useState('');
const[password,setPassword] = useState('');
const navigate = useNavigate();

const handlesubmit = async (e) =>{
    e.preventDefault();
    try{
        await axios.post("http://localhost:4000/register",{username,password});
        alert("user added");
        navigate('/login');

    }catch(err){
        console.error("error occured:",err);
        alert("failed to insert")
    }
}
  return (
    <div className='register'>
     <div className='container'>
     <h1>Create Account</h1>
      <form onSubmit={handlesubmit}>
      <label>username:</label>
      <input type='text' value={username}onChange={(e) =>setUsername(e.target.value)} placeholder='enter name'required/><br /><br />
      <label>password</label>
          <input type='password' value={password}onChange={(e) =>setPassword(e.target.value)} placeholder='enter password'required/><br /><br />
          <input type='submit' value='Register'/>
      </form>
      </div>
    </div>
  )
}

export default Register;

