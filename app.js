const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname +"/date.js");

const app = express();

var items = [];
var workItems = [];

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(__dirname + "/public"))
app.set("view engine", "ejs");


let day = date.getDate();

app.get("/", function (req, res) {
    res.render("index", {
        kindOfDay: day,
        newListItem: items
    })
})

app.get("/Work", function (req, res) {

    res.render("index", {
        kindOfDay: "Work List",
        newListItem: workItems
    })
});

app.post("/", function (req, res) {
    var toDoListItem = req.body.new_item;
    if (req.body.list === "Work List") {
        workItems.push(toDoListItem);
        res.redirect("/work");
    } else {
        items.push(toDoListItem);
        res.redirect("/");
    }



})






app.listen("3000", function () {
    console.log("server is up and running....")
})