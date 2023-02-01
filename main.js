//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/User');
const Result = require('./models/result');
const dayjs = require('dayjs');


const app = express();
const PORT = process.env.PORT || 4000;

const dbUri = "mongodb+srv://rn_test:rntest1234@resultmanagement.lxngyne.mongodb.net/Result_Mangement?retryWrites=true&w=majority";

mongoose.connect(dbUri,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error',(error)=>{console.log(error)});
db.once('open',()=> console.log('Connected with database'));

//middleWares
app.use(express.urlencoded({extended: false}))  //is a body parser for html post form
app.use(express.json());

app.use(session({
  secret:'myScerets',
  saveUninitialized: true,
  resave:false
}));

//middleware for storing session message

app.use((req, res,next)=>{
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});


// set or register view engine 

app.set('view engine', 'ejs');


app.get("/",(req,res)=>{
  res.render("welcome");
});

app.get("/login",(req,res)=>{
  res.render("login");
});
app.post("/login",async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

 const user =  await User.findOne({email:email});
  if(user === null)
  {

  }
  else{
    if(user.role === 'teacher')
    {
    res.redirect("/home")
    }
    else if(user.role === 'student')
    {
      res.redirect("/searchResult")
    }
  }
});

app.get("/signUP",(req,res)=>{
  res.render("signUp");
});

app.post("/signUp",(req,res)=>{
    const userRequest = new User({
      email: req.body.email,
      password: req.body.password,
      role:req.body.role
    });

    console.log(userRequest);

    userRequest.save((err)=>{
         if(err)
         {
        //   req.session.message = {
        //     type:'danger',
        //     message: err.message
        // }
          res.redirect('/welcome');
         }
         else
         {
        // req.session.message = {
        //     type:'danger',
        //     message: err.message
        // }
            res.redirect('/login');
         }
    });
});

app.get("/searchResult",(req,res)=>{
  res.render("searchResult")
})

app.post("/searchResult", (req,res)=>{
   const name = req.body.name;
   const rollnumber = req.body.rollnumber;
   console.log(name)
   console.log(rollnumber)
   Result.findOne({name:name, rollnumber:rollnumber},(err,result)=>{
      if(err)
      {
        res.json({message:"No Data Found"});
      }
      else
      {
        console.log(result)
        res.render("searchResultData",{
          result: result
        })
        
      }
   });
  // res.json(result)
  // console.log(result);

});

app.use("",require("./routes/routes"));



app.listen(PORT,()=>{
    console.log(`Server Started at http://localhost:${PORT}`);
});

