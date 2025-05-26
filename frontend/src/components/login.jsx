import React,{ useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(){

const[username,setUsername] = useState('');
const[password,setPassword] = useState('');
const navigate=useNavigate();


const handlesubmit = async (e) =>{
    e.preventDefault();
    try{
        await axios.post("http://localhost:4000/login",{username,password});
        alert("login successful");
        navigate("/d");
    }catch(err){
        console.error("error occured:",err);
        alert("login failed")
    }
}
  return (
    <div className='login'>
    <h1>Login Here</h1>
      <form onSubmit={handlesubmit}>
      <label>username:</label>
      <input type='text' value={username}onChange={(e) =>setUsername(e.target.value)} placeholder='enter name'required/><br/><br/>
      <label>password:</label>
          <input type='password' value={password}onChange={(e) =>setPassword(e.target.value)} placeholder='enter password'required/><br/><br/>
          <input type='submit'/>
      </form>
    </div>
  )
}

export default Login;

