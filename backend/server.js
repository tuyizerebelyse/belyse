const express = require('express');
const cors = require('cors');
const mysql = require ('mysql2');
const port=4000;
const app = express();

//MIDDLEWARE

app.use(express.json());
app.use(cors());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"epms"
});
db.connect((err,result) =>{
if (err) 
{
    console.err('🚥🌋db not connected')
} else{
    console.log('🚞db connected')
}
});

// USER API
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const sql = "INSERT INTO users(`username`, `password`) VALUES (?, ?)";

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
        console.log('User inserted');
        return res.status(201).json({ message: "User added successfully" });
    });
});
// employee api
app.post('/employee', (req, res) => {
    const { FirstName	,LastName,	Address	,Position	,Telephone	,Gender	,HiredDate	,DepartmentCode} = req.body;
    const sql = "INSERT INTO employee(`FirstName`,`LastName`,`Address`,	`Position`,	`Telephone`,`Gender`,	`HiredDate`,	`DepartmentCode`) VALUES (?,?,?,?,?,?,?,?)";

    db.query(sql, [FirstName,LastName,Address,Position,Telephone,	Gender	,HiredDate	,DepartmentCode	], (err, result) => {
        if (err) {
            console.error("Error occurred:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
        console.log('employee inserted');
        return res.status(201).json({ message: "User added successfully" });
    });
});
//DEPARTMENT API
app.post('/department',(req,res) =>{
    const{DepartmentCode,DepartmentName} = req.body;
    const sql="INSERT INTO department(`DepartmentCode`,`DepartmentName`)values(?,?)";
    db.query(sql,[DepartmentCode,DepartmentName],(err,result) =>{
         if (err) {
            console.error("Error occurred:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
        console.log('department inserted');
        return res.status(201).json({ message: "User added successfully" });
    })
})
app.get('/fetch',(req,res) =>{
    const sql ="SELECT * FROM department";
    db.query(sql,(err,result) =>{
        if (err){
            console.error("not fetched:",err);
            res.status(500).json({message:"something went wrong"});
        }
        console.log("well fetched",result);
        // res.status(201).json({message:"data fetched"})
        res.json(result)
    })
})
app.post('/salary',(req,res) =>{
    const{EmployeeID,GrossSalary,TotalDeduction,PaymentMonth} = req.body;	
    const NetSalary = GrossSalary - TotalDeduction;
    const sql="INSERT INTO payroll(`EmployeeID`,	`GrossSalary`,	`TotalDeduction`,	`NetSalary`	,`PaymentMonth`)values(?,?,?,?,?)"	
  db.query(sql,[EmployeeID,GrossSalary,TotalDeduction,NetSalary,PaymentMonth],(err,result) =>{
         if (err) {
            console.error("Error occurred:", err);
            return res.status(500).json({ message: "Something went wrong" });
        }
        console.log('department inserted');
        return res.status(201).json({ message: "salary added successfully" });
    })
}
)
app.get('/fetchemp',(req,res) =>{
    const sql="SELECT * FROM employee";
      db.query(sql,(err,result) =>{
        if (err){
            console.error("not fetched:",err);
            res.status(500).json({message:"something went wrong"});
        }
        console.log("well fetched",result);
        res.json(result)
    })
})

app.get('/report',(req,res) =>{
    const sql=`SELECT e.FirstName, e.LastName, e.Position, d.DepartmentName, p.GrossSalary, p.TotalDeduction, p.NetSalary, p.PaymentMonth 
    FROM payroll p JOIN employee e ON p.EmployeeID= e.EmployeeID JOIN department d ON e.DepartmentCode= d.DepartmentCode ORDER BY p.PaymentMonth DESC`;
     db.query(sql,(err,result) =>{
        if (err){
            console.error("not fetched:",err);
            res.status(500).json({message:"something went wrong"});
        }
        console.log("well fetched",result);
        res.json(result)
    })
})
app.get('/reportemployee',(req,res) =>{
    const sql =` SELECT 
    FirstName,	
LastName,
Address,
Position,
Telephone,
Gender,
HiredDate
 from employee`;
db.query(sql,(err,result) =>{
    if (err){
        console.error("error occured:",err)
        res.status(500).json({message:"something went wrong"})
    }
    console.log("well fetched",result)
    res.json(result);
})
})
app.get('/dep',(req,res)=>{
   
    const sql= 'SELECT DepartmentCode,DepartmentName from department';
    db.query(sql,(err,result) =>{
        if(err){
 console.error("error occured:",err)
 res.status(500).json('something went wrong')
        }
           console.log('well done',result)
           res.json(result);
    })
})

app.post('/login',(req,res) =>{
    const{username,password} = req.body;
    const sql='SELECT * FROM users WHERE username=?';

    db.query(sql,[username,password],(err,result) =>{
       if (err){
        console.error("error occured:",err)
        res.status(500).json({message:"something went wrong"})
    }
    console.log("login successful",result)
    res.json(result);
    })
  
})
app.get('/fetchs',(req,res) =>{
    const sql="SELECT GrossSalary,TotalDeduction,NetSalary,PaymentMonth FROM payroll";
    db.query(sql,(err,result) =>{
   if (err){
        console.error("error occured:",err)
        res.status(500).json({message:"something went wrong"})
    }
    console.log("fetch successful",result)
    res.json(result);
    });
});
app.listen(port,() =>{
    console.log(`server is running on ${port}`);
})