import React, {useState} from "react";
import axios from "axios";

function Signup(){
const [name, setName] = useState("");
const [password, setPassword] = useState("");

const handlesubmit = async(e) =>{
    e.preventDefault();

   
        await axios.post("http://localhost:4000/user" , {name, password});
        alert("inserted");

}
return(
    <>
<style>{`
    p{
    margin-left: -220%;
    font-weight: bold;
    font-size: 20px;
    font-family: ;
    margin-top: -100px;
    }
    `}</style>
    <p>BERWA SHOP</p>
    <form  onSubmit={handlesubmit} >

<style>{`
                body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: url(../../public/photo1.jpg) no-repeat;
                    background-size: cover;
                    animation: fadeInBody 1s ease-in;
                }

                @keyframes fadeInBody {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                form {
                    max-width: 600px;
                    margin-top: 60px;
                    background: rgba(0, 0, 0, 0.75);
                    padding: 35px 30px;
                    border-radius: 15px;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    animation: fadeInForm 1s ease-in-out;
                    color: white;
                }

                @keyframes fadeInForm {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                select, input[type="text"], input[type="password"] {
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    background-color:rgba(0, 0, 0, 0.19);
                    width: 450px;
                }
                
                form label{

                  text-align: left;
                }

                select:focus, input[type="text"]:focus, input[type="date"]:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
                    background-color: #fff;
                }

                input[type="submit"] {
                    padding: 12px;
                    background-color: #007bff;
                    color: white;
                    font-size: 16px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s ease, background-color 0.3s ease;
                }

                input[type="submit"]:hover {
                    background-color: #0056b3;
                    transform: scale(1.05);
                }
            `}</style>
            <h2>REGISTER</h2>
        <label><b>Enter username</b></label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="enter name" />
        <label><b>Enter password</b></label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="enter password" />
        <input type="submit"/>
    </form></>

 );

}
export default Signup;