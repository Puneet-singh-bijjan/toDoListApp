const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const lodash = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/public', express.static(__dirname + "/public"))
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/itemsDB" , { useNewUrlParser: true ,  useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);

const itemSchema = {
    itemsList: String
};

const Item = mongoose.model("Item" , itemSchema);

const item1 = {
    itemsList : "Welcome to todolist!",
}

const item2 = {
    itemsList : "Hit the + button to add an item",
}

const item3 = {
    itemsList : "<-- Hit this to delete an item"
}

const defaultItems = [item1 , item2 , item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List" , listSchema);

app.get("/:routeListName" , function(req , res){
    const customListName = req.params.routeListName;

    List.findOne({name:customListName} , function(err , foundList){
        if(!err){
            if(!foundList){
                const customListItem = new List({
                    name: customListName,
                    items: defaultItems
                });
                customListItem.save();
                res.redirect("/" + customListName);
            }else{
                res.render("index", {
                    kindOfDay: foundList.name,
                    newListItem: foundList.items
                })
            }
        }
    })
})


app.get("/", function (req, res) {

    Item.find({} , function(err , foundItems){

        if (foundItems.length === 0){
           
            Item.insertMany(defaultItems , function(err){
                if (err){
                console.log("u fucked up...");
                }else{
                    console.log("successful incertion...");
                }
                res.redirect("/");
            })
            }else{
                res.render("index", {
                    kindOfDay: "Today",
                    newListItem: foundItems 
                });
            }

    }); 
});



app.post("/", function (req, res) {
    var toDoListItem = req.body.new_item;
    const ListName = req.body.list;

    const item = new Item ({
        itemsList : toDoListItem
    });

    if (ListName === "Today") {
      
        item.save();
        res.redirect("/");
    } else {
       List.findOne({name:ListName} , function(err , foundList){
           foundList.items.push(item);
           foundList.save();
           res.redirect("/" + ListName);
       });
    }
});

app.post("/delete" , function(req , res){
    const deleteItem = req.body.checkbox;
    const listName = req.body.listNName;

    if(listName === "Today"){
        Item.findByIdAndDelete(deleteItem , function(err ){
            if (err){
                console.log("oops u fucked up in deleting data...");
            }else{
                console.log("success in deleting data...");
            }
            res.redirect("/");
        })
    }else{
        List.findOneAndUpdate({name:listName} , {$pull : {items : {_id : deleteItem}}} , function(err , results){
            if(!err){
                res.redirect("/" + listName);
               
            }
    })
}
});


app.listen(process.env.PORT || "3000", function () {
    console.log("server is up and running....")
});




//lodash.capitalize(