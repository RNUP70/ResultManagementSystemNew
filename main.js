//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');


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

app.use("",require("./routes/routes"));


app.get("/",(req,res)=>{
    res.send("Hello world");
});

app.listen(PORT,()=>{
    console.log(`Server Started at http://localhost:${PORT}`);
});

