const express = require('express')
const cors = require ('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require ('path')
const { MongoClient, ObjectId } = require("mongodb");
//router routes
const userroutes = require ('./routes/userroutes')
const authorizationroutes = require ('./routes/authorizationroutes')
const eventroutes = require ('./routes/eventroutes')
const taskroutes = require ('./routes/taskroutes')

const User = require('./model/User')
const client = new MongoClient(process.env.MONGO_URL)
//setup express server
const app = express()
const { body, validationResult } = require('express-validator');

// set up views
app.set('views',path.join(__dirname,"views"))
app.set('view engine','pug')
app.use(cors());

//for server to serve static files from public folder,use another middleware
app.use(express.static(path.join(__dirname,'public')));

//middleware 
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/userapi',userroutes)
app.use('/authapi',authorizationroutes)
app.use('/eventapi',eventroutes)
app.use('/taskapi',taskroutes)


//routes
let dbUrl = process.env.MONGO_ATLAS_URL;

const mongoose = require('mongoose');



mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true

});

const db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.get("/",async(req,res)=>{
    let links = await getAllLinks();
    let users = await getUsers();
// res.status('200').send('Hello World')
// res.render("template",{title:"E-commerce Website"});
res.render("index",{ title: "Home" , menu: links, users: users });
})



//other pages --------------------------------

app.get("/about", async (req, res) => {
    let links = await getAllLinks();
    console.log(links);
    res.render("about", { title: "About" , menu: links });
});

//Admin pages

// admin menu-list
app.get("/admin/menu", async(req, res) => {
let links = await getAllLinks();
res.render("menu-list", { title: "Menu links", menu: links });
});

//admin add menu link
app.get("/admin/menu/add", async(req, res) => {
let links = await getAllLinks();
res.render("menu-add", {title:'Add menu link', menu: links });
});

//admin update menu link
app.get("/admin/menu/update",async(req, res) => {
let links= await getAllLinks();
let selectedLink = await getSelectedLink(req.query.linkId);
console.log( selectedLink);
res.render("menu-update", {title: "Update menu link", menu: links,selectedMenu:selectedLink });
});


//admin  Submit menu links 
app.post("/admin/menu/add/submit", async (req, res) => {
    
let newLink = {
    name: req.body.name,
    weight: req.body.weight,
    path:req.body.path,
  
 };
 await addMenuLink(newLink);
 res.redirect("/admin/menu");
});

//DELETE menulink route
app.get("/admin/menu/delete", async (req, res) => {
let id = req.query.linkId;
await deleteMenuLink(id);
res.redirect("/admin/menu");
});


//POST For update form
app.post("/admin/menu/update/submit", async (req, res) => {
let id = req.query.linkId;
let updatedLink = {
        name: req.body.name,
        path: req.body.path,
        weight: req.body.weight
     };
await updateLink(id, updatedLink);
res.redirect("/admin/menu");
});


//mongo helper functions 

async function connection() {

    db = client.db("testdb");
    // console.log('database connected')
    return db;
}

async function connection1() {

  db = client.db("testdb1");
  // console.log('database connected')
  return db;
}

async function getUsers(){
db = await connection1 ();
var results  = db.collection("users").find({});
resultsArray = await results.toArray();
return resultsArray
}





app.listen(process.env.PORT,()=>{
console.log(`App listening at port http://localhost:${process.env.PORT}`)
})