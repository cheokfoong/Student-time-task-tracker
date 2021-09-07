var express = require('express');
var path = require('path');
var routes = require("./routes");
var app = express();
var db = require('./public/javascripts/database.js');


app.use(express.urlencoded( { extended : false}));
app.set("port", process.env.PORT || 4000);
app.use(express.static(__dirname + '/public')); // use to get the external JS files stored in public folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(routes);

app.listen(app.get("port"), function(){
    console.log("server started on port" + app.get("port"));
})