const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user : "root",
    password : "",
    database: "berwashop"
});

db.connect(err =>{
    if (err) throw err;
    console.log("connected")
});

//API
app.post("/user", (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: "Missing fields" });
  
    const query = "INSERT INTO shopkeeper (name, password) VALUES (?, ?)";
    db.query(query, [name, password], (err, result) => {
  if (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }
    return res.status(500).json({ error: "Database error", details: err });
  }

  res.json({ message: "Account created successfully" });
});
  });
  
//product API

app.post('/product', (req,res) =>{
    const {pcode, pname} = req.body;
    const sql = "INSERT into product(`pcode`,`pname`) values (?,?)";
    db.query(sql, [pcode, pname], (err, result) => {
        if (err) throw err;
        res.send("inserted");
    });
});



//productin API

app.post('/buy', (req,res)=>{
    const { pcode, date, quantity, price} = req.body;
    const total = price*quantity;

    const sql = "insert into pin(`pcode`,`date`,`quantity`,`price`,`total`) values(?,?,?,?,?)";
    const sql2 = "INSERT INTO stock (pcode, quantity) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
    
    db.query(sql, [pcode, date, quantity, price, total], (err1, result1) => {
        if (err1) {
            console.error(err1);
            return res.status(500).json({ message: "Failed to insert into pin" });
        }

        db.query(sql2, [pcode, quantity], (err2, result2) => {
            if (err2) {
                console.error(err2);
                return res.status(500).json({ message: "Failed to update stock" });
            }

            res.send("Stock-in recorded and stock updated successfully.");
        });
    });
    

});

app.get('/fetch', (req,res) =>{
    const sql = "select * from product";
    db.query(sql, (err,result) =>{
        if(err){
            return res.status(500).json({message:"server error!"});
        }
        res.json(result);
    });
});

app.post('/sell', (req,res) =>{
    const {pcode, date, quantity, price} = req.body;
    const total = quantity*price;

    const sql = "insert into pout(`pcode`,`date`,`quantity`,`price`,`total`) value (?,?,?,?,?)";
    const sql3 = "UPDATE stock SET quantity = quantity - ? WHERE pcode = ? AND quantity >= ?";

    db.query(sql3, [quantity, pcode, quantity], (err4,result) =>{

        if(err4){
            res.status(500).json({message:'server error!'})
        }

        if(result.affectedRows === 0){
            res.status(400).json({message:'Stock Not Available'})
        }
        
        db.query(sql, [pcode,date,quantity,price,total], (err,result) =>{
            if(err){
                res.status(500).json({message:'server error!'})
            }
            res.send({ message: 'Product sold successfully.' });
           
            });

    });
  
    });

app.get('/report1', (req,res) =>{
    const sql1 = "select * from pin";

    db.query(sql1, (err,result) =>{
        if(err){
           return res.status(500).json({message:'server error!'})
        }
        res.json(result)
    });

   

})

app.get('/report2', (req,res) =>{
    const sql2 = "select * from pout";

    db.query(sql2, (err,result) =>{
        if(err){
           return res.status(500).json({message:'server error!'})
        }
        res.json(result)
    });

   
})

app.get('/report3', (req,res) =>{
    const sql3 = "select * from stock";

    db.query(sql3, (err,result) =>{
        if(err){
           return res.status(500).json({message:'server error!'})
        }
        res.json(result)
    });

   
})

app.get('/report4', (req,res) =>{
    const sql4 = "select * from product";

    db.query(sql4, (err,result) =>{
        if(err){
           return res.status(500).json({message:'server error!'})
        }
        res.json(result)
    });

   
})


app.post("/login", (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: "Missing fields" });
  
    const query = "SELECT * FROM shopkeeper WHERE name = ? AND password = ?";
    db.query(query, [name, password], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });
  
      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      res.json({ message: "Login successful", user: { id: results[0].id, name: results[0].name } });
    });
  });

  app.delete('/delete/:rid', (req, res) => {
    const { rid } = req.params;
    const sql = "DELETE FROM pout WHERE rid = ?";
    
    db.query(sql, [rid], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete record", details: err });
      }
      res.send("Record deleted successfully.");
    });
  });
  
  app.delete('/delete1/:rid', (req, res) => {
    const { rid } = req.params;
    const sql = "DELETE FROM pin WHERE rid = ?";
    
    db.query(sql, [rid], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Failed to delete record", details: err });
      }
      res.send("Record deleted successfully.");
    });
  });

  
app.put('/update/:rid', (req, res) => {
  const { date, quantity, price } = req.body;
  const total = quantity*price
  const { rid } = req.params;

  const sql = "UPDATE pin SET date = ?, quantity = ?, price = ?, total = ? WHERE rid = ?";
  db.query(sql, [date, quantity, price, total, rid], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error!", details: err });
    }
    res.send("Record updated successfully.");
  });
});

app.put('/updatee/:rid', (req, res) => {
  const { date, quantity, price } = req.body;
  const total = price*quantity
  const { rid } = req.params;

  const sql1 = "UPDATE pout SET date = ?, quantity = ?, price = ?, total = ? WHERE rid = ?";
  db.query(sql1, [date, quantity, price, total, rid], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error!", details: err });
    }
    res.send("Record updated successfully.");
  });
});

app.listen(port, ()=>{
    console.log(`running well at http://localhost:${port}`);
});