const express=require('express');
// const session=require('express-session');
const mysql=require('mysql2');
const bcrypt=require('bcrypt');
const cors=require('cors');
const app=express();

const PORT=3001;

app.use(cors());
app.use(express.json());
// app.use((session)=>{

// });

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'customer_info'
});

db.connect((err)=>{
    if(err){
        throw err;
    }
});

app.get('/orders', (req, res) => {
    const sql = `
      SELECT o.*, p.unitprice, p.productquantity
      FROM orders o
      JOIN products p ON o.productcode = p.productcode
    `;
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send('Error fetching orders');
      }
      res.json(result);
    });
});
  

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users(username, password) VALUES (?, ?)';

    db.query(sql, [username, hashed], (err, result) => {
        if (err) {
            return res.status(500).send('Error in Registering!');
        }

        res.status(200).send('User registered successfully!');
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';

    db.query(sql, [username], async (err, result) => {
        if (err) {
            return res.status(500).send('Error in Login');
        }

        const user = result[0];

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return res.send("Logged in successfully");
        } else {
            return res.status(401).send("Invalid username or password");
        }
    });
});


// PUT: update customer
app.put('/customers/:id', (req, res) => {
    const { id } = req.params;
    const { cust_fname, cust_lname, location, telephone } = req.body;
    const sql = 'UPDATE customers SET cust_fname=?, cust_lname=?, location=?, telephone=? WHERE customerid=?';
    db.query(sql, [cust_fname, cust_lname, location, telephone, id], (err, result) => {
      if (err) return res.status(500).send('Error updating customer');
      res.send('Customer updated');
    });
  });
  
  // DELETE: remove customer
  app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM customers WHERE customerid = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send('Error deleting customer');
      res.send('Customer deleted');
    });
  });
  


app.post('/products', (req, res) => {
    const { productname, productquantity, unitprice } = req.body;

    // Convert quantities to integers
    const quantity = parseInt(productquantity);
    const price = parseInt(unitprice);
    const totalprice = quantity * price;

    const check = 'SELECT * FROM products WHERE productname = ?';
    db.query(check, [productname], (err, checkresult) => {
        if (err) {
            console.error('Error checking product:', err);
            return res.status(500).send('Error in fetching products');
        }

        const existingProduct = checkresult[0];

        if (!existingProduct) {
            const sql = 'INSERT INTO products (productname, productquantity, unitprice, totalprice) VALUES (?, ?, ?, ?)';
            db.query(sql, [productname, quantity, price, totalprice], (err, result) => {
                if (err) {
                    console.error('Error inserting product:', err);
                    return res.status(500).send('Error in inserting product');
                }
                return res.status(200).send('Product inserted well!');
            });
        } else {
            return res.status(400).send("The product is already recorded in database...!!");
        }
    });
});

app.post('/customerin',(req,res)=>{
    const {cust_fname,cust_lname,location,telephone}=req.body;
    const sql='INSERT INTO customers(cust_fname,cust_lname,location,telephone) VALUES(?,?,?,?)';

    db.query(sql,[cust_fname,cust_lname,location,telephone],(err,result)=>{
        if(err){
            return res.status(500).send('Error in inserting new customer');
        }
        res.send('Customer inserted well!')
    });
});

app.get('/products', (req, res) => {
    const sql = 'SELECT productcode, productname, productquantity, unitprice FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send('Error in load products');
        }
        res.json(result);
    });
});

app.get('/customers', (req, res) => {
    const sql = 'SELECT customerid, cust_fname, cust_lname, location, telephone FROM customers';
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send('Error in fetching customers!');
        }
        res.json(result);
    });
});

app.post('/orderin',(req,res)=>{
    const {ordernumber,orderdate,productcode,customerid}=req.body;
    const sql='INSERT INTO orders(ordernumber,orderdate,productcode,customerid) VALUES(?,?,?,?)';
    db.query(sql,[ordernumber,orderdate,productcode,customerid],(err,result)=>{
        if(err){
            return res.status(500).send('Error in inserting new order')
        }
        res.status(200).send('Order inserted well')
    })
})
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM products WHERE productcode = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send('Error deleting product');
      res.send('Product deleted');
    });
  });

  app.put('/products/:id', (req, res) => {
    const { id } = req.params;
    const { productname, productquantity, unitprice } = req.body;
    const totalprice = parseInt(productquantity) * parseInt(unitprice);

    const sql = 'UPDATE products SET productname=?, productquantity=?, unitprice=?, totalprice=? WHERE productcode=?';
    db.query(sql, [productname, productquantity, unitprice, totalprice, id], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating product');
        }
        res.send('Product updated successfully');
    });
});

app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const { orderdate, productcode, customerid } = req.body;

    const sql = 'UPDATE orders SET orderdate=?, productcode=?, customerid=? WHERE ordernumber=?';
    db.query(sql, [orderdate, productcode, customerid, id], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating order');
        }
        res.send('Order updated successfully');
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});