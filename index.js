import express from "express"
import bodyParser from "body-parser";
import pg from "pg"


const app = express()
const port = 3000;

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "signup",
    password: "user",
    port: 5432,
  });
  db.connect();
  let users =[{fName:"jasir",lName:"ahsan",
    phone:7034081363,
    age:21,
    email:"jasir@gmail.com",
    password:"123",
    
  }]

  


app.get('/', async( req,res)=>{
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id ASC");
    users = result.rows;

    

      res.send(users)
    res.render("index.ejs", {
    });
  } catch (err) {
    console.log(err,"Error 404 not found");
  }
})


app.post("/sign-up" ,async (req,res)=>{

    const { fname, lname, phone, age, email, password } = req.body;

  try{
    const result = await db.query(
      "INSERT INTO users (fname,lname,phone,age,email,password) VALUES($1,$2,$3,$4,$5,$6)RETURNING *",
      [fname,lname,phone,age,email,password])
    res.status(201).json({ Mission: 'success', userData: result.rows[0] });

    console.log("Sign up Successfull",); 
    console.log(result.rows[0]);
  }catch (err){
        console.log(err);
        res.send("Somethig went wrong")   
    }
})

app.put("/edit", async (req,res)=>{
  const { fname, lname, phone, age, email, password,id } = req.body;

    try{
      const result =await db.query("UPDATE users SET fname =$1,lname= $2,phone=$3,age=$4,email=$5,password=$6 WHERE id =$7 RETURNING *;",
        [fname,lname,phone,age,email,password,id ])
        res.status(201).json({Kollam:"Poli", userData:result.rows[0]} )
    }catch (err){
      console.log("MOONJI",err);
      
    }
})

app.delete("/delete", async (req,res)=>{
const  id  = req.query.id;
console.log(req.query.id);
  
  try{
    const result = await db.query(
      "DELETE FROM users WHERE id = $1",
      [id])

    res.status(200).json({messege:"deleted", deletedUserData : result.rows[0]})

}
catch(err){"veendum Moonji", err}
})

app.listen(port, ()=>{
    console.log("server started")
})