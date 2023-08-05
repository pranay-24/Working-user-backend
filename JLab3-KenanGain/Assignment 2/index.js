const express = require("express");
const path = require("path"); // this is included with Node
const { MongoClient, ObjectId } = require("mongodb");

const { request } = require("http");

//MONGODB Setup
//const dbUrl = "mongodb://localhost:27017/testdb";  //if this connection string, use the one below
const dbUrl = "mongodb://127.0.0.1:27017/testdb";
const client = new MongoClient(dbUrl);

const app = express();  // Creating an express app
const port = process.env.PORT || "8889";

//Set up express app to use as pug template
app.set("views",path.join(__dirname, "views"));
app.set("view engine", "pug");

// All the images are taken from master chef bbq site

app.use(express.static(path.join(__dirname, "public")));

//The next two lines tells express to convert form data into Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
    let links = await getAllLinks();
    console.log(links);
    response.render("index", { title: "Home" , menu: links });
});
app.get("/about", async (request, response) => {
    let links = await getAllLinks();
    console.log(links);
    response.render("about", { title: "About" , menu: links });
});
//ADMIN PAGES FOR MENU LINKS
app.get("/admin/menu", async (request, response) => {
    let links = await getAllLinks();
    response.render("menu-list", { title: "Administer menu links", menu: links });
});
app.get("/admin/menu/add", async (request, response) => {
    let links = await getAllLinks();
    response.render("menu-add", { title: "Add menu link", menu: links });
});
app.get("/admin/menu/update", async (request, response) => {
    let links = await getAllLinks();
    let selectedLink = await getSelectedLink(request.query.linkId);
    console.log(selectedLink);
    response.render("menu-update", { title: "Update menu link", menu: links, selectedMenu: selectedLink });
});
// POST form submission code for the add menu link page
app.post("/admin/menu/add/submit", async (request, response) => {
    //create a json object with the field names from the menuLinks collection and laod the values from the form via request.body.?
 let newLink = {
    name: request.body.name,
    path: request.body.path,
    weight: request.body.weight
 };
 await addMenuLink(newLink);
 response.redirect("/admin/menu");
});

//GET from submission code for the delete form
app.get("/admin/menu/delete", async (request, response) => {
    //get the_id
    let id = request.query.linkId;

    //use _id to delete menu link document
    await deleteMenuLink(id);
    //resirect to admin listing page
    response.redirect("/admin/menu");
});

//POST For update form
app.post("/admin/menu/update/submit", async (request, response) => {
    let id = request.body.linkId;
    let updatedLink = {
        name: request.body.name,
        path: request.body.path,
        weight: request.body.weight
     };
     await updateLink(id, updatedLink);
     response.redirect("/admin/menu");
});

// Set up Server Listening
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

//MONGODB HELPER FUNCTIONS
async function connection() {
    db = client.db("testdb");
    return db;
}
async function getAllLinks() {
    db = await connection();
    let results = db.collection("menuLinks").find({});
    resultsArray = await results.toArray();
    return resultsArray;
}
async function addMenuLink(newLink) {
    db = await connection();
    let status = await db.collection("menuLinks").insertOne(newLink);
    console.log("link added");
}
async function deleteMenuLink(id) {
    db = await connection();
    let deleteFilter = { _id: new ObjectId(id) };
    let result = await db.collection("menuLinks").deleteOne(deleteFilter);
    if (result.deletedCount == 1) {
        console.log("delete successful");
    }
}
async function getSelectedLink(linkId) {
    db = await connection();
    let result = db.collection("menuLinks").find({ _id: new ObjectId(linkId) });

    resultsArray = await result.toArray();
    return resultsArray[0];
}
async function updateLink(linkId, updatedLink) {
    db = await connection();
    let updateFilter = { _id: new ObjectId(linkId) };
    let status = await db.collection("menuLinks").updateOne(updateFilter, { $set: updatedLink });
    if (status.modifiedCount === 1) {
        console.log("link updated");
    }
}